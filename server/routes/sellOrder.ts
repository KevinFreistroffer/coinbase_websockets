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

const ACCESS_METHOD = "POST";
const COINBASE_API = process.env.COINBASE_API;
const BASE_ROUTE = process.env.BASE_ROUTE;

router.post("/:product", (req: Request, res: Response) => {
  console.log("SELL ORDER ROUTE REACHED", req.body);

  const body = req.body;
  const PRODUCT = req.params.product;
  const price = body.price; // todo

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

  if (COINBASE_API && BASE_ROUTE) {
    console.log("bodyzz", body);

    /**
     * 
     *  order_id: '04805bc4-749d-487e-8b2d-ce441924a88b',
  client_order_id: '5fc9095d-ef39-4887-8f71-7db333898215',
  cumulative_quantity: '0.00016',
  leaves_quantity: '0',
  avg_price: '14595.68',
  total_fees: '0.0046706176',
  status: 'FILLED',
  product_id: 'SOL-USD',
  creation_time: '2023-11-17T14:33:05.503928Z',    
  order_side: 'BUY',
  order_type: 'Limit',
  cancel_reason: '',
  reject_Reason: ''

  abc
     */

    const baseSize = body.quantity;
    const limitPrice = (Number(body.price) * 0.999).toFixed(2).toString();
    const stopPrice = (Number(body.price) * 0.999).toFixed(2).toString();
    const data: string = JSON.stringify({
      side: "SELL",
      client_order_id: createUUID(),
      product_id: PRODUCT,
      order_configuration: {
        stop_limit_stop_limit_gtc: {
          base_size: baseSize,
          limit_price: limitPrice,
          stop_price: stopPrice,
          stop_direction: "UNKNOWN_STOP_DIRECTION",
        },
      },
    });

    console.log("SELL DATA", data);
    const resource = resources.orders;
    const timeInSeconds = createTimeInSeconds();
    const hmac = createHMAC(timeInSeconds, ACCESS_METHOD, resource, data);
    const headers = createHeaders(hmac, timeInSeconds);
    fetch(COINBASE_API + BASE_ROUTE + resource, {
      method: ACCESS_METHOD,
      headers,
      body: data,
    })
      .then((resp) => {
        if (resp.status === 400) {
          return res
            .status(400)
            .json({ data: "FIX THIS -- await resp.text()" });
        }

        if (resp.status === 401) {
          return res.status(401).json({ data: "Unauthorized" });
        }
        if (resp.status === 200 || resp.status === 201) {
          // const body = await resp.json();

          return res.status(200).json({ data: resp.json() });
        }
      })
      .catch((err) => {
        return res.status(500).json({ data: err });
      });

    /**
     * 
     *  success: true,
  failure_reason: 'UNKNOWN_FAILURE_REASON',        
  order_id: 'b9b9e702-2b69-4266-8da8-347099e00ab5',
  success_response: {
    order_id: 'b9b9e702-2b69-4266-8da8-347099e00ab5',
    product_id: 'SOL-USD',
    side: 'BUY',
    client_order_id: '9908b64d-a574-4048-ab96-cd7417d22c72'
  },
  order_configuration: {
    limit_limit_gtc: { base_size: '0.00016', limit_price: '14600.00', post_only: false }
  }
     */
  } else {
    res.status(500).json({ data: "COINBASE_API or BASE_ROUTE not found" });
  }
});

module.exports = router;
