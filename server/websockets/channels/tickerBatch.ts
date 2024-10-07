import { Application } from "express";
import { has, isEmpty } from "lodash";
import WebSocket from "ws";

interface IData {
  channel: string;
  client_id: string;
  timestamp: string;
  sequence_num: number;
  events: Array<{
    type: string;
    tickers: Array<{
      product_id: string;
      price: string;
      volume_24_h: string;
      low_24_h: string;
      high_24_h: string;
      low_52_w: string;
      high_52_w: string;
      price_percent_chg_24_h: string;
    }>;
  }>;
}

export const handleTickerBatch = (app: Application, data: IData): void => {
  // console.log("Ticker ticker_batch -", data.events[0]);
  /*
   {
  channel: 'ticker_batch',
  client_id: '',
  timestamp: '2023-11-04T16:02:46.284590695Z',
  sequence_num: 4,
  events: [ { type: 'update', tickers: [Array] } ]
  */

  if (has(data, "events")) {
    const eventType = data.events[0].type;
    const tickers = data.events[0].tickers[0];
    console.log(
      "Ticker batch - " + tickers["product_id"] + "=" + tickers.price
    );
    // console.log("app.locals.filledOrderz", app.locals.filledOrder);

    if (app.locals.filledOrder && !isEmpty(app.locals.filledOrder)) {
      if (tickers["product_id"] === "SOL-USD") {
        const filledOrder: {
          clientOrderId: string;
          orderId: string;
          price: string;
          quantity: string;
        } = app.locals.filledOrder;

        if (tickers.price > filledOrder.price) {
          if (Number(tickers.price) - Number(filledOrder.price) > 0.1) {
            console.log("SELL SELL SELL");
            const ws = new WebSocket("ws://localhost:8000");
            ws.on("open", function open() {
              console.log("Sending sell order");
              ws.send(
                JSON.stringify({
                  channel: "ticker_batch",
                  product_id: "SOL-USD",
                  type: "subscribe",
                })
              );
            });
          }
        }
      }
    }

    /* 
   *  type: 'ticker',
  product_id: 'SOL-USD',
  price: '41.43',
  volume_24_h: '1712983.827',
  low_24_h: '38.52',
  high_24_h: '42.73',
  low_52_w: '8',
  high_52_w: '46.97',
  price_percent_chg_24_h: '4.22641509433962'
   */
    if (eventType === "update") {
    }
  }
};

export default handleTickerBatch;
