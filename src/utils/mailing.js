import { createTransport } from "nodemailer";

export const mailTransporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "trudykingsberry@gmail.com",
    pass: "phxz ablq zupq myed",
  },
});

mailTransporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const registerUserMailTemplate = `<div>
<h1>Dear {{username}},</h1>
<p>Your account has been created !</p>
<p>Thank You!</p>
</div>`;

export const resetPasswordMailTemplate = (username, resetLink) => `
  <p>Hello ${username},</p>
  <p>You requested to reset your password. Click the link below to proceed:</p>
  <a href="${resetLink}">${resetLink}</a>
  <p>This link will expire in 1 hour. If you did not request this, you can ignore this email.</p>
`;

// export const sendEmail = async (options) => {
//   const { to, subject, text, html } = options;

//   const mailOptions = {
//     from: process.env.USER_EMAIL || "Your Store <noreply@yourstore.com>",
//     to,
//     subject,
//     text,
//     html,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);

//     if (process.env.NODE_ENV !== "production") {
//       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     }

//     return info;
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     throw error;
//   }
// };

// export const sendOrderConfirmationEmail = async (email, order) => {
//   const items = order.items
//     .map((item) => {
//       const product = item.productId;
//       const name = product.name || "Product";
//       return `${name} x ${item.quantity} - $${(
//         item.price * item.quantity
//       ).toFixed(2)}`;
//     })
//     .join("<br>");

//   const subtotal = order.totalAmount || 0;
//   const shipping = order.shippingCost || 0;
//   const total = subtotal + shipping;

//   const orderRef =
//     order.orderReference ||
//     `ORD-${order._id.toString().substr(-6).toUpperCase()}`;

//   const subject = `Order Confirmation #${orderRef}`;

//   const text = `
//     Thank you for your order!
    
//     Order Reference: ${orderRef}
//     Status: ${order.status}
//     Payment Method: ${order.paymentMethod}
    
//     Items:
//     ${order.items
//       .map((item) => {
//         const name = item.productId.name || "Product";
//         return `${name} x ${item.quantity} - $${(
//           item.price * item.quantity
//         ).toFixed(2)}`;
//       })
//       .join("\n")}
    
//     Subtotal: $${subtotal.toFixed(2)}
//     Shipping: $${shipping.toFixed(2)}
//     Total: $${total.toFixed(2)}
    
//     Shipping Address:
//     ${order.fullName}
//     ${order.address}
    
//     Thank you for shopping with us!
//   `;

//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Thank you for your order!</h2>
//       <p><strong>Order Reference:</strong> ${orderRef}</p>
//       <p><strong>Status:</strong> ${order.status}</p>
//       <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      
//       <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary</h3>
//       <table style="width: 100%; border-collapse: collapse;">
//         <tr style="border-bottom: 1px solid #eee;">
//           <th style="text-align: left; padding: 8px;">Product</th>
//           <th style="text-align: center; padding: 8px;">Quantity</th>
//           <th style="text-align: right; padding: 8px;">Price</th>
//         </tr>
//         ${order.items
//           .map((item) => {
//             const name = item.productId.name || "Product";
//             return `
//             <tr style="border-bottom: 1px solid #eee;">
//               <td style="padding: 8px;">${name}</td>
//               <td style="text-align: center; padding: 8px;">${
//                 item.quantity
//               }</td>
//               <td style="text-align: right; padding: 8px;">$${(
//                 item.price * item.quantity
//               ).toFixed(2)}</td>
//             </tr>
//           `;
//           })
//           .join("")}
//       </table>
      
//       <table style="width: 100%; margin-top: 20px;">
//         <tr>
//           <td style="text-align: right; padding: 8px;"><strong>Subtotal:</strong></td>
//           <td style="text-align: right; width: 100px; padding: 8px;">$${subtotal.toFixed(
//             2
//           )}</td>
//         </tr>
//         <tr>
//           <td style="text-align: right; padding: 8px;"><strong>Shipping:</strong></td>
//           <td style="text-align: right; padding: 8px;">$${shipping.toFixed(
//             2
//           )}</td>
//         </tr>
//         <tr style="font-size: 1.2em;">
//           <td style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
//           <td style="text-align: right; padding: 8px;"><strong>$${total.toFixed(
//             2
//           )}</strong></td>
//         </tr>
//       </table>
      
//       <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
//         <h3>Shipping Address</h3>
//         <p>
//           ${order.fullName}<br>
//           ${order.address}
//         </p>
//       </div>
      
//       <p style="margin-top: 30px; color: #777; font-size: 0.9em;">
//         Thank you for shopping with us! If you have any questions about your order,
//         please contact our customer service team.
//       </p>
//     </div>
//   `;

//   return sendEmail({
//     to: email,
//     subject,
//     text,
//     html,
//   });
// };

// export const sendOrderStatusUpdateEmail = async (
//   email,
//   order,
//   oldStatus,
//   newStatus
// ) => {
//   const orderRef =
//     order.orderReference ||
//     `ORD-${order._id.toString().substr(-6).toUpperCase()}`;

//   // Create email content
//   const subject = `Order #${orderRef} Status Update`;

//   const text = `
//     Your Order Status Has Been Updated
    
//     Order Reference: ${orderRef}
//     Previous Status: ${oldStatus}
//     New Status: ${newStatus}
    
//     You can track your order by logging into your account.
    
//     Thank you for shopping with us!
//   `;

//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Your Order Status Has Been Updated</h2>
//       <p><strong>Order Reference:</strong> ${orderRef}</p>
      
//       <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//         <p><strong>Previous Status:</strong> ${oldStatus}</p>
//         <p style="font-size: 1.2em; color: #4CAF50;"><strong>New Status:</strong> ${newStatus}</p>
//       </div>
      
//       <p>
//         You can track your order by logging into your account.
//       </p>
      
//       <p style="margin-top: 30px; color: #777; font-size: 0.9em;">
//         Thank you for shopping with us! If you have any questions about your order,
//         please contact our customer service team.
//       </p>
//     </div>
//   `;

//   return sendEmail({
//     to: email,
//     subject,
//     text,
//     html,
//   });
// };


// //payment Reciept Email
// export const sendPaymentReceiptEmail = async (email, order, payment) => {
//   const orderRef =
//     order.orderReference ||
//     `ORD-${order._id.toString().substr(-6).toUpperCase()}`;
//   const paymentRef = payment.reference || payment._id;

//   const paymentDate = new Date(payment.date || Date.now()).toLocaleDateString();

//   const subject = `Payment Receipt for Order #${orderRef}`;

//   const text = `
//     Payment Receipt
    
//     Order Reference: ${orderRef}
//     Payment Reference: ${paymentRef}
//     Payment Date: ${paymentDate}
//     Payment Method: ${order.paymentMethod}
//     Amount: $${payment.amount.toFixed(2)}
    
//     Thank you for your payment!
//   `;

//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Payment Receipt</h2>
      
//       <div style="border: 1px solid #eee; padding: 20px; border-radius: 5px; margin: 20px 0;">
//         <p><strong>Order Reference:</strong> ${orderRef}</p>
//         <p><strong>Payment Reference:</strong> ${paymentRef}</p>
//         <p><strong>Payment Date:</strong> ${paymentDate}</p>
//         <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
//         <p><strong>Amount:</strong> $${payment.amount.toFixed(2)}</p>
//       </div>
      
//       <p style="margin-top: 30px; color: #777; font-size: 0.9em;">
//         Thank you for your payment! If you have any questions about your order,
//         please contact our customer service team.
//       </p>
//     </div>
//   `;

//   return sendEmail({
//     to: email,
//     subject,
//     text,
//     html,
//   });
// };

