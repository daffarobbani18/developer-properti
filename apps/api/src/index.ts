import cors from "cors";
import express from "express";
import morgan from "morgan";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { crmRouter } from "./routes/crm";
import { fieldRouter } from "./routes/field";
import { financeRouter } from "./routes/finance";
import { legalRouter } from "./routes/legal";
import { notificationRouter } from "./routes/notifications";
import { portalRouter } from "./routes/portal";
import { projectRouter } from "./routes/project";
import { publicRouter } from "./routes/public";
import { vendorRouter } from "./routes/vendor";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.corsOrigins.length === 0 || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin tidak diizinkan oleh CORS"));
    }
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "simdp-api" });
});

app.use("/auth", authRouter);
app.use("/public", publicRouter);
app.use("/crm", crmRouter);
app.use("/finance", financeRouter);
app.use("/project", projectRouter);
app.use("/vendor", vendorRouter);
app.use("/legal", legalRouter);
app.use("/portal", portalRouter);
app.use("/field", fieldRouter);
app.use("/notifications", notificationRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`SIMDP API berjalan di http://localhost:${config.port}`);
});
