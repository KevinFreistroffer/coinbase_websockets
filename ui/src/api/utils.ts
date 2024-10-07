import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
import { v4 as uuidv4 } from "uuid";

export const createUUID = (): string => {
  return uuidv4();
};

export const createTimeInSeconds = (): number => {
  return Math.ceil(new Date().getTime() / 1000);
};

export const createHMAC = (
  timeInSeconds: number,
  accessMethod: string,
  resource: string,
  data?: string
): string => {
  if (!process.env.REACT_APP_API_SECRET) {
    throw new Error("API_SECRET not found");
  }

  console.log("timeInSeconds", timeInSeconds);
  console.log("accessMethod", accessMethod);
  console.log("resource", resource);
  console.log("data", data);

  let ACCESS_SIGN =
    timeInSeconds + accessMethod + process.env.REACT_APP_BASE_ROUTE + resource;
  if (data) {
    ACCESS_SIGN += data;
  }

  // const hmac = createHmac("sha256", process.env.API_SECRET)
  //   .update(ACCESS_SIGN)
  //   .digest("hex");

  const hashDiegst = sha256(process.env.REACT_APP_API_SECRET);
  const hmac = Base64.stringify(hmacSHA512(hashDiegst, ACCESS_SIGN));

  return hmac;
};

export const createHeaders = (
  hmac: string,
  timeInSeconds: number
): HeadersInit => {
  if (!process.env.REACT_APP_API_KEY) {
    throw new Error("API_KEY not found");
  }

  const requestHeaders: HeadersInit = new Headers({
    "CB-ACCESS-KEY": process.env.REACT_APP_API_KEY || "",
    "CB-ACCESS-SIGN": hmac,
    "CB-ACCESS-TIMESTAMP": timeInSeconds.toString(),
    "Content-Type": "application/json",
  });
  return requestHeaders;
};
