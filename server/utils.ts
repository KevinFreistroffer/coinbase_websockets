import { v4 as uuidv4 } from "uuid";
const { createHmac } = require("node:crypto");

export const createUUID = (): string => {
  return uuidv4();
};

export const createTimeInSeconds = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

export const createHMAC = (
  timeInSeconds: number,
  accessMethod: string,
  resource: string,
  data?: string
): string => {
  if (!process.env.API_SECRET) {
    throw new Error("API_SECRET not found");
  }

  let ACCESS_SIGN =
    timeInSeconds + accessMethod + process.env.BASE_ROUTE + resource;
  if (data) {
    ACCESS_SIGN += data;
  }

  const hmac = createHmac("sha256", process.env.API_SECRET)
    .update(ACCESS_SIGN)
    .digest("hex");

  return hmac;
};

export const createHeaders = (
  hmac: string,
  timeInSeconds: number
): HeadersInit => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY not found");
  }

  const requestHeaders: HeadersInit = new Headers({
    "CB-ACCESS-KEY": process.env.API_KEY,
    "CB-ACCESS-SIGN": hmac,
    "CB-ACCESS-TIMESTAMP": timeInSeconds.toString(),
    "Content-Type": "application/json",
  });

  return requestHeaders;
};
