import express from "express";
import cors from "cors";
import path from "path";
import { setupSwagger } from "./core/config/swagger.js";

// Rute (akan di-update bertahap ke module routes)
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/projects.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import sitePlanRoutes from "./modules/site-plans/site-plans.routes.js";
import salesRoutes from "./modules/sales/sales.routes.js";
import financeRoutes from "./modules/finance/finance.routes.js";
import billingRoutes from "./modules/billing/billing.routes.js";
import constructionRoutes from "./modules/construction/construction.routes.js";
import legalRoutes from "./modules/legal/legal.routes.js";
import commissionRoutes from "./modules/commission/commission.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import reportingRoutes from "./modules/reporting/reporting.routes.js";
import publicRoutes from "./modules/public/public.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

setupSwagger(app);

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/construction", constructionRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/site-plans", sitePlanRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reports", reportingRoutes);
app.use("/api/public", publicRoutes);

export default app;
