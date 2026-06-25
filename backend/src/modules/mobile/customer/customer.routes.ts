import { Router } from "express";
import { getOverview, getProgress, getBilling, submitPaymentProof, getDocuments, getSupportData, createTicket } from "./customer.controller.js";

const router = Router();

router.get("/overview", getOverview);
router.get("/progress", getProgress);
router.get("/billing", getBilling);
router.post("/payments", submitPaymentProof);
router.get("/documents", getDocuments);
router.get("/support", getSupportData);
router.post("/support/tickets", createTicket);

export default router;
