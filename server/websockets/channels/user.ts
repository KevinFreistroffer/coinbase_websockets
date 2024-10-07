// @ts-nocheck
import { Application } from "express";
import { has } from "lodash";

export const handleUser = (app: Application, data: unknown): void => {
  console.log("Channel = user - ", data);

  // FILLED
  // {
  //   order_id: '648e5939-7bd9-40c5-a88e-4b8ba51fe838',
  //   client_order_id: 'f770a551-508a-41c5-81c1-d9d9bca8005e',
  //   cumulative_quantity: '0.08',
  //   leaves_quantity: '0',
  //   avg_price: '40.81',
  //   total_fees: '0.0065296',
  //   status: 'FILLED',
  //   product_id: 'SOL-USD',
  //   creation_time: '2023-11-06T04:16:05.213452Z',
  //   order_side: 'BUY',
  //   order_type: 'Limit',
  //   cancel_reason: '',
  //   reject_Reason: ''
  // }
  const { client_id, timestamp, sequence_num, events } = data;

  const eventType = events[0].type;
  const orders = events[0].orders;

  console.log("Channel = user - eventType=", eventType);

  if (orders.length) {
    const order = orders[0];
    console.log("Channel = user - order=", order);

    if ("status" in order) {
      // FILLED ORDER
      if (order.status === "FILLED" && order.order_side === "BUY") {
        console.log("Channel = user - order filled", order);
        const {
          order_id,
          client_order_id,
          avg_price: price,
          cumulative_quantity: quantity,
        } = order;
        app.locals.orderId = order_id;
        app.locals.clientOrderId = client_order_id;
        app.locals.filledOrder = {
          orderId: order_id,
          clientOrderId: client_order_id,
          price,
          quantity,
        };

        fetch("http://localhost:8000/sell-order/SOL-USD", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            orderId: order_id,
            clientOrderId: client_order_id,
            price,
            quantity,
          }),
        })
          .then((res) => {
            console.log("res", res);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    }
  }
  /**
   * channel: 'user',
  client_id: '',
  timestamp: '2023-11-04T16:23:15.751940523Z',
  sequence_num: 0,
  events: [ { type: 'snapshot', orders: [Array] } ]
   */
};

export default handleUser;
