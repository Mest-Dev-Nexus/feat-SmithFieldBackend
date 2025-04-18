import {Schema, model} from 'mongoose';

const ContactInfoSchema = new Schema({
  email: String,
  phone: String,
  facebook: String,
  twitter: String,
  instagram: String
});

export const ContactInfoModel = model("ContactInfo", ContactInfoSchema);


const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
 
}, {timestamps: true});

export const ContactMessageModel = model("ContactMessage", ContactMessageSchema);




const FaqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

export const FaqModel = model("Faq", FaqSchema);
