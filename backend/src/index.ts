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
import propertyTypeRoutes from "./routes/property-types.route.js";
import unitRoutes from "./routes/units.route.js";
import sitePlanRoutes from "./routes/site-plans.route.js";
import uploadRoutes from "./routes/upload.route.js";
import path from "path";
import { setupSwagger } from "./config/swagger.js";

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/property-types", propertyTypeRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/site-plans", sitePlanRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "simdp-backend" });
});

app.listen(port, () => {
  console.log(`SIMDP backend running on http://localhost:${port}`);
});
