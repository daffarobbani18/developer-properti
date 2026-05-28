import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/projects.route.js";
import salesRoutes from "./routes/sales.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import sitePlanRoutes from "./routes/site-plans.route.js";
import uploadRoutes from "./routes/upload.route.js";
import path from "path";
import { setupSwagger } from "./config/swagger.js";

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/site-plans", sitePlanRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "simdp-backend" });
});

app.listen(port, () => {
  console.log(`SIMDP backend running on http://localhost:${port}`);
});
