const { time } = require("node:console");
const { createHmac } = require("node:crypto");
const uuid = require("uuid");

export const createUUID = (): string => {
  return uuid.v4();
};

export const createTimeInSeconds = (): number => {
  return Math.ceil(new Date().getTime() / 1000);
};

export const createHMAC = (
  timeInSeconds: number,
  accessMethod: string,
  resource: string,
  data: string
): string => {
  let ACCESS_SIGN =
    timeInSeconds + accessMethod + process.env.BASE_ROUTE + resource;
  if (data) {
    ACCESS_SIGN += data;
  }

  console.log("ACCESS_SIGN", ACCESS_SIGN);

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

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("CB-ACCESS-KEY", process.env.API_KEY || "");
  requestHeaders.set("CB-ACCESS-SIGN", hmac);
  requestHeaders.set("CB-ACCESS-TIMESTAMP", timeInSeconds.toString());
  requestHeaders.set("Content-Type", "application/json");
  // console.log(requestHeaders);
  return requestHeaders;
};
