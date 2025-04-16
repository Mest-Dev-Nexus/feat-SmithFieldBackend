import { createTransport } from "nodemailer";

export const mailTransporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "trudykingsberry@gmail.com",
    pass: "phxz ablq zupq myed",
  },
});

export const registerUserMailTemplate = `<div>
<h1>Dear {{username}},</h1>
<p>A new account has been created for you!</p>
<p>Thank You!</p>
</div>`;
