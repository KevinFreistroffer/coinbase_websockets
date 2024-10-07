import express, { Application, Request, Response } from "express";
import { createHMAC, createHeaders, createTimeInSeconds } from "../utils";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const timeInSeconds = createTimeInSeconds();
  const hmac = createHMAC(
    timeInSeconds,
    "GET",
    "/brokerage/products/BTC-USD/ticker"
  );
  const headers = createHeaders(hmac, timeInSeconds);
  const resp = await fetch(
    "https://coinbase.com/v2/exchange-rates?currency=USD",
    {
      method: "GET",
      headers,
    }
  );
  if (resp.status === 401) {
    return res.status(401).json({ data: "Unauthorized" });
  }
  if (resp.status === 200 || resp.status === 201) {
    const body = await resp.json();
    return res.status(200).json({ data: body });
  }
});

module.exports = router;
