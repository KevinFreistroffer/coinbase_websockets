import express, { Application, Request, Response } from "express";
import {
  createHMAC,
  createHeaders,
  createTimeInSeconds,
  createUUID,
} from "../utils";
import resources from "../resources";
import { SIDE } from "../constants";

const router = express.Router();

const ACCESS_METHOD = "GET";
const COINBASE_API = process.env.COINBASE_API;
const BASE_ROUTE = process.env.BASE_ROUTE;

router.get("/", async (req: Request, res: Response) => {
  if (COINBASE_API && BASE_ROUTE) {
    const resource = resources.getFills;
    const timeInSeconds = createTimeInSeconds();
    const hmac = createHMAC(timeInSeconds, ACCESS_METHOD, resource);
    const headers = createHeaders(hmac, timeInSeconds);
    const resp = await fetch(COINBASE_API + BASE_ROUTE + resource, {
      headers,
    });

    if (resp.status === 401) {
      return res.status(401).json({ data: "Unauthorized" });
    }
    if (resp.status === 200 || resp.status === 201) {
      const body = await resp.json();

      return res.status(200).json({ data: body });
    }
  } else {
    res.status(500).json({ data: "COINBASE_API or BASE_ROUTE not found" });
  }
});

module.exports = router;
