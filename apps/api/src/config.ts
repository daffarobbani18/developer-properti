import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitCsv = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const config = {
  port: parseNumber(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET ?? "super-secret-change-me",
  corsOrigins: splitCsv(process.env.CORS_ORIGIN)
};
