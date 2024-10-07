import express, { Application, Request, Response } from "express";
import {
  createHMAC,
  createHeaders,
  createTimeInSeconds,
  createUUID,
} from "../utils";
import resources from "../resources";
import { SIDE } from "../constants";
import websockets from "../websockets/ws";

const router = express.Router();

const ACCESS_METHOD = "POST";
const COINBASE_API = process.env.COINBASE_API;
const BASE_ROUTE = process.env.BASE_ROUTE;

router.get("/:product", async (req: Request, res: Response) => {
  // websockets(app);
  const PRODUCT = req.params.product;
  const price = ".001";

  if (!PRODUCT) {
    return res.status(500).json({ data: "PRODUCT not found" });
  }

  // const productResponse = await fetch(
  //   `http://localhost:8000/get-product/${req.params.product}`
  // );
  // const { data } = await productResponse.json();
  // let { price } = data;

  if (!price) {
    return res.status(500).json({ data: "price not found" });
  }

  // const fillsResponse = await fetch("http://localhost:8000/get-fills");

  if (COINBASE_API && BASE_ROUTE && price) {
    const data: string = JSON.stringify({
      order_ids: ["339a8059-e78e-4167-bf50-53d9fb3d057b"],
    });
    const resource = resources.canceLOrders;
    const timeInSeconds = createTimeInSeconds();
    const hmac = createHMAC(timeInSeconds, ACCESS_METHOD, resource, data);
    const headers = createHeaders(hmac, timeInSeconds);
    const resp = await fetch(COINBASE_API + BASE_ROUTE + resource, {
      method: ACCESS_METHOD,
      headers,
      body: data,
    });

    if (resp.status === 400) {
      return res.status(400).json({ data: await resp.text() });
    }

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
