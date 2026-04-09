import { HttpError } from "./errors";

export const readRouteParam = (value: string | string[] | undefined, key: string): string => {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (!normalized) {
    throw new HttpError(400, `Parameter ${key} wajib diisi`);
  }

  return normalized;
};