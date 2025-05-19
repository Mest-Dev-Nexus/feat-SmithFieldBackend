import mongoose from "mongoose";
import { ProductModel } from "../models/product.js";
import { OrderModel } from "../models/order.js";
import { ConsumerModel } from "../models/consumer.js";
import { DiscountModel } from "../models/discount.js";
import { deliveryAddressModel } from "../models/delivery.js";
import { orderAmountCalc } from "../helpers/order.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.auth?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Authentication error",
        error: ["User not authenticated. Please log in to complete checkout."],
      });
    }
    const { deliveryAddress, city, region } = req.body.deliveryAddress;

    const { cart, promocode } = req.body;

    const address = {
      deliveryAddress,
      city,
      region,
    };

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart error",
        error: ["Your cart is empty"],
      });
    }

    const populatedCartItems = [];
    for (const item of cart.items) {
      const product = await ProductModel.findById(item.product);

      if (!product) {
        return res.status(400).json({
          message: "Product error",
          error: [`Product with ID ${item.product} was not found`],
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: "Inventory error",
          error: [
            `Not enough stock for "${product.title}". Available: ${product.countInStock}, Requested: ${item.quantity}`,
          ],
        });
      }

      populatedCartItems.push({
        product: {
          _id: product._id,
          price: product.price,
          title: product.title,
        },
        quantity: item.quantity,
      });
    }

    let discount = null;
    if (promocode) {
      discount = await DiscountModel.findOne({
        promocode,
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (!discount) {
        console.log(`Promocode ${promocode} is invalid or expired`);
      }
    }
    let deliveryId = null;
    let deliveryRate = 10;
    try {
      const deliveryData = await deliveryAddressModel.findOne({
        region: region,
        city: city,
      });

      if (deliveryData) {
        deliveryId = deliveryData._id;
        deliveryRate = deliveryData.rate;
        console.log(
          `Using shipping rate: ${deliveryRate} for ${country}, ${region}`
        );
      } else {
        console.log(
          `No shipping rate found for ${region}. Using default rate of ${deliveryRate}.`
        );
      }
    } catch (error) {
      console.error("Error fetching shipping rate:", error);
    }

    const calculateOrder = orderAmountCalc(
      populatedCartItems,
      deliveryRate,
      discount
    );
    const costingDetails = calculateOrder();

    const newOrder = await OrderModel.create({
      address,
      cart: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      costing: {
        subTotal: costingDetails.subTotal,
        discountAmount: costingDetails.discountAmount || 0,
        amountAfterDiscount: costingDetails.amountAfterDiscount,
        deliveryCost: costingDetails.deliveryCost,
        grandTotal: costingDetails.grandTotal,
        discountApplied: costingDetails.discountApplied || false,
        deliveryId,
      },
      user: userId,
      status: "not paid",
    });

    return res.status(201).json({
      message: "Order created successfully. Please proceed to payment.",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order from cart:", error);
    next(error);
  }
};

/* complete the order after successful payment*/

export const completeOrderAfterPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.auth?.id;
    const { paymentDetails } = req.body;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }
    const order = await OrderModel.findById(orderId).populate("cart.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        message: "You don't have permission to access this order",
      });
    }
    if (order.status !== "not paid") {
      return res.status(400).json({
        message: "This order has already been processed",
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of order.cart) {
        await ProductModel.updateOne(
          { _id: item.product },
          { $inc: { countInStock: -item.quantity } },
          { session }
        );
      }
      await OrderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            status: "pending",
            paymentDetails: paymentDetails || {},
          },
        },
        { session }
      );
      await OrderModel.findOneAndUpdate(
        { user: userId },
        { items: [] },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Payment successful. Order has been confirmed.",
        orderId: order._id,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error completing order after payment:", error);
    next(error);
  }
};

/* Get order by ID*/
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.auth?.id;
    const isAdmin = req.auth?.role === "admin";

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID format",
      });
    }

    // Find order and populate product details
    const order = await OrderModel.findById(id).populate({
      path: "cart.product",
      select: "title price images", // Only get needed fields
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check permission: must be order owner or admin
    if (order.user.toString() !== userId && !isAdmin) {
      return res.status(403).json({
        message: "You don't have permission to access this order",
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.auth?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filterOptions = { user: userId };

    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    const totalOrders = await OrderModel.countDocuments(filterOptions);
    const orders = await OrderModel.find(filterOptions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "cart.product",
        select: "title price images",
      });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      data: orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        hasNextPage: skip + orders.length < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    if (req.auth?.role !== "Administrator") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filterOptions = {};

    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    if (req.query.userId) {
      filterOptions.user = req.query.userId;
    }
    if (req.query.startDate && req.query.endDate) {
      filterOptions.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }
    const totalOrders = await OrderModel.countDocuments(filterOptions);
    const orders = await OrderModel.find(filterOptions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "cart.product",
        select: "title price images",
      })
      .populate({
        path: "user",
        select: "name email consumerType", 
      });

    return res.status(200).json({
      message: "All orders retrieved successfully",
      data: orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        hasNextPage: skip + orders.length < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.auth?.role !== "Adminstrator") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    // Validate status value
    const validStatuses = [
      "not paid",
      "pending",
      "processing",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        error: [`Status must be one of: ${validStatuses.join(", ")}`],
      });
    }

    // Find and update the order
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    next(error);
  }
};
