import { ProductModel } from "../../models/shop/shopModel.js";
import { addProductValidator } from "../../validators/shop/shopValidator.js";

export const addProduct = async (req, res, next) => {
  try {
    const { error, value } = addProductValidator.validate(
      {
        ...req.body,
        image: req.file?.filename,
      },
      { abortEarly: false }
    );

    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    const newProduct = await ProductModel.create({
      ...value,
      userId: req.auth.id,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, availability, limit = 10, offset = 0 } = req.query;
    const filter = { deleted: false };

    if (category) filter.category = category;
    if (availability !== undefined)
      filter.availability = availability === "true";

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.params.id,
      deleted: false,
    }).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

export const countProducts = async (req, res, next) => {
  try {
    const count = await ProductModel.countDocuments({ deleted: false });
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
