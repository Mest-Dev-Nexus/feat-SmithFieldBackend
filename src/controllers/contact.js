import { contactMessageSchema } from "../validators/contact.js";
import { ContactMessageModel } from "../models/DataModels.js/contactMessageModel.js";
import { FaqModel } from "../models/";
import { ContactInfoModel } from "../models/ContactInfoModel";

export const addMessage = async (req, res, next) => {
  try {
    const { error, value } = contactMessageSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const newMessage = await ContactMessageModel.create(value);

    res.status(201).json({
      message: "Message received successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getFaqs = async (req, res, next) => {
  try {
    const faqs = await FaqModel.find();
    res.status(200).json({ message: "FAQs fetched successfully", data: faqs });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getContactInfo = (async = (req, res, next) => {
  try {
    const contact = ContactInfoModel.findOne();
    res
      .status(200)
      .json({ message: "Contact info fetched successfully", data: contact });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});
