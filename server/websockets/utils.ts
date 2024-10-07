import CryptoJS from "crypto-js";

export const sign = (str: string, secret: string) => {
  const hash = CryptoJS.HmacSHA256(str, secret);
  return hash.toString();
};

export const timestampAndSign = (
  message: Record<string, unknown>,
  channel: string,
  products: string[] = [],
  SIGNING_KEY?: string
) => {
  if (!SIGNING_KEY) {
    throw new Error("SIGNING_KEY is not defined");
  } else {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const strToSign = `${timestamp}${channel}${products.join(",")}`;
    const sig = sign(strToSign, SIGNING_KEY);
    return { ...message, signature: sig, timestamp: timestamp };
  }
};
