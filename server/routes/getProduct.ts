import express, { Application, Request, Response } from "express";
import { createHMAC, createHeaders, createTimeInSeconds } from "../utils";
import resources from "../resources";

const ACCESS_METHOD = "GET"; // todo enum or const
const COINBASE_API = process.env.COINBASE_API;
const BASE_ROUTE = process.env.BASE_ROUTE;
const router = express.Router();

router.get("/:product", async (req: Request, res: Response) => {
  if (!COINBASE_API || !BASE_ROUTE) {
    res.status(500).json({ data: "COINBASE_API or BASE_ROUTE not found" });
  } else {
    const PRODUCT = req.params.product;

    if (!PRODUCT) {
      return res.status(500).json({ data: "PRODUCT not found" });
    }

    const timeInSeconds = createTimeInSeconds();
    const hmac = createHMAC(
      timeInSeconds,
      ACCESS_METHOD,
      `${resources.getProduct}/${PRODUCT}`
    );
    const headers = createHeaders(hmac, timeInSeconds);
    const resp = await fetch(
      COINBASE_API + BASE_ROUTE + resources.getProduct + `/${PRODUCT}`,
      {
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
  }
});

module.exports = router;
