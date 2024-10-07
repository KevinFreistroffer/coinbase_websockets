import express, { Application, Request, Response } from "express";
import {
  createHMAC,
  createHeaders,
  createTimeInSeconds,
  createUUID,
} from "../utils";
import resources from "../resources";
import { SIDE } from "../constants";
import { has } from "lodash";
import { WebSocket } from "ws";

module.exports = (app: Application) => {
  const router = express.Router();
  router.get("/:product", async (req: Request, res: Response) => {
    try {
      //console.log("req.params.product", req.params.product);
      const ACCESS_METHOD = "POST";
      const COINBASE_API = process.env.COINBASE_API;
      const BASE_ROUTE = process.env.BASE_ROUTE;

      if (!COINBASE_API || !BASE_ROUTE) {
        res.status(500).json({ data: "COINBASE_API or BASE_ROUTE not found" });
      }

      if (!req.params.product) {
        return res.status(500).json({ data: "PRODUCT not found" });
      }

      let config = {
        method: "get",
        url: "https://api.coinbase.com/api/v3/brokerage/products?limit=1&product_ids=SOL-USD",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (COINBASE_API && BASE_ROUTE) {
        const productResp = await fetch(
          "http://localhost:8000/get-product/SOL-USD"
        );
        const productData = await productResp.json();
        //console.log("productData", productData);

        /**
       * data: {
    product_id: 'SOL-USD',
    price: '0.70845',
    price_percentage_change_24h: '3.86306993109515',
    volume_24h: '29263836',
    volume_percentage_change_24h: '-0.14205541041388',
    base_increment: '1',
    quote_increment: '0.00001',
    quote_min_size: '1',
    quote_max_size: '10000000',
    base_min_size: '1',
    base_max_size: '689655172.4137931034482759',
    base_name: 'Big Time',
    quote_name: 'US Dollar',
    watched: true,
    is_disabled: false,
    new: false,
    status: 'online',
    cancel_only: false,
    limit_only: false,
    post_only: false,
    trading_disabled: false,
    auction_mode: false,
    product_type: 'SPOT',
    quote_currency_id: 'USD',
    base_currency_id: 'SOL',
    fcm_trading_session_details: null,
    mid_market_price: '',
    alias: '',
    alias_to: [ 'SOL-USDC' ],
    base_display_symbol: 'SOL',
    quote_display_symbol: 'USD',
    view_only: false,
    price_increment: '0.00001'
  }
       */

        const data: string = JSON.stringify({
          product_id: "SOL-USD",
          side: "BUY",
          client_order_id: createUUID(),
          order_configuration: {
            limit_limit_gtc: {
              base_size: ".11",
              limit_price: Number(productData.data.price).toFixed(2).toString(),
              post_only: false,
            },
          },
        });
        //console.log("placeOrderDfdsata", data);
        const resource = resources.orders;
        const timeInSeconds = createTimeInSeconds();
        const hmac = createHMAC(timeInSeconds, ACCESS_METHOD, resource, data);
        const headers = createHeaders(hmac, timeInSeconds);
        const resp = await fetch(COINBASE_API + BASE_ROUTE + resource, {
          method: ACCESS_METHOD,
          headers,
          body: data,
        });

        //console.log("resp.stafdstus!!!", resp.status);

        if (resp.status === 401) {
          return res.status(401).json({ data: "Unauthorized" });
        }
        if (resp.status === 200 || resp.status === 201) {
          const body = await resp.json();
          //console.log("body", body);

          if (body.success) {
            if (has(body, "success_response")) {
              const { order_id } = body.success_response;
              app.locals.orderId = order_id;

              // const ws = new WebSocket("ws://localhost:8000");
              // ws.on("open", function open() {
              //   console.log("Sending sell order");
              //   ws.send(
              //     JSON.stringify({
              //       channel: "user",
              //       product_id: "SOL-USD",
              //       type: "subscribe",
              //     })
              //   );
              // });

              // ws.on("message", function incoming(data) {
              //   console.log("data", data);
              // });

              // ws.on("close", function close() {
              //   console.log("disconnected");
              // });

              // ws.on("error", function error(err) {
              //   console.log("error", err);
              // });
            }
          }

          /*
        {
          success: true,
          failure_reason: 'UNKNOWN_FAILURE_REASON',
          order_id: 'bc384ba8-89c9-4eb6-818f-4f29c97e167f',    
          success_response: {
            order_id: 'bc384ba8-89c9-4eb6-818f-4f29c97e167f',  
            product_id: 'SOL-USD',
            side: 'BUY',
            client_order_id: '2f170f8b-e397-492e-ac49-c93439551183'
          },
          order_configuration: {
            limit_limit_gtc: { base_size: '5', limit_price: '0.72117', post_only: false }
          }
        */

          return res.status(200).json({ data: body });
        }
      } else {
        res.status(500).json({ data: "COINBASE_API or BASE_ROUTE not found" });
      }
    } catch (error) {
      console.log("try catch error", error);
      res.status(500).json({ data: error });
    }
  });

  return router;
};
