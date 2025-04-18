import { Router } from "express";
import { submitContactMessage, getFaqs, getContactInfo } from "../controllers/contactController";

const router = Router();

router.post("/contact", submitContactMessage); // for bulk buyers
router.get("/faqs", getFaqs); // frontend fetches FAQs
router.get("/contact-info", getContactInfo); // frontend fetches phone, email, socials

export default router;
