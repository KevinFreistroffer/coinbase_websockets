const { SIDE } = require("../constants");

const {
  createTimeInSeconds,
  createUUID,
  createHMAC,
  createHeaders,
} = require("../utils");
const { resources } = require("../resources");
require("dotenv").config({ path: "../../.env" });

const ACCESS_METHOD = "POST";

const placeOrder = (
  resource: string,
  side: string,
  product_id: string,
  limit_price: string,
  amount: string
) => {
  if (!process.env.isDEV) {
    let data: string = JSON.stringify({
      product_id,
      side,
      client_order_id: createUUID(),
      order_configuration: {
        limit_limit_gtc: {
          base_size: amount,
          limit_price,
          post_only: false,
        },
      },
    });

    try {
      // timestamp + method + requestPath
      const timeInSeconds = createTimeInSeconds();
      const hmac = createHMAC(timeInSeconds, ACCESS_METHOD, resource, data);
      const headers = createHeaders(hmac, timeInSeconds);

      const request = async () => {
        const api = process.env.COINBASE_API;
        const baseRoute = process.env.BASE_ROUTE;
        if (!!api && !!baseRoute) {
          console.log("data", data);
          fetch(api + baseRoute + resource, {
            method: ACCESS_METHOD,
            headers,
            body: data,
          })
            .then((resp) => {
              return resp.json();
            })
            .then((body) => {
              console.log(body);
              const successResponse = body.success_response;
              const orderConfiguration = body.order_configuration;
              const orderId = successResponse.order_id;
              const side = successResponse.side;
              const clientOrderId = successResponse.client_order_id;
              const amount = orderConfiguration.limit_limit_gtc.base_size;
              const limitPrice = orderConfiguration.limit_limit_gtc.limit_price;
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      };
      request();
    } catch (error) {
      // console.log(error);
    }
  }

  /**
 * {
  success: true,
  failure_reason: 'UNKNOWN_FAILURE_REASON',
  order_id: '34780a98-6288-4e73-97ba-29ffee1067a2',
  success_response: {
    order_id: '34780a98-6288-4e73-97ba-29ffee1067a2',
    product_id: 'SOL-USD',
    side: 'BUY',
    client_order_id: '10'
  },
  order_configuration: {
    limit_limit_gtc: { base_size: '1', limit_price: '10.0', post_only: false }
  }
}
 */
};

placeOrder(resources.createOrder, SIDE.BUY, "SOL-USD", "10.0", "1");

export default placeOrder;
