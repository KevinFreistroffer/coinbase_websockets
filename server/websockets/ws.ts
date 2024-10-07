// JS Example for subscribing to a channel

import WebSocket from "ws";
import CryptoJS from "crypto-js";
import { Application } from "express";
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
import {
  handleMarketTrades,
  handleTickerBatch,
  handleTicker,
  handleUser,
  handleSubscriptions,
  handleLevel2,
  handleHeartBeat,
  handleCandles,
  handleStatus,
} from "./channels";
import { timestampAndSign } from "./utils";

// Derived from your Coinbase Retail API Key
//  SIGNING_KEY: the signing key provided as a part of your API key. Also called the "SECRET KEY"
//  API_KEY: the api key provided as a part of your API key. also called the "PUBLIC KEY"

const websockets = (app: Application) => {
  console.log("websockets()");
  const SIGNING_KEY = process.env.API_SECRET;
  const API_KEY = process.env.API_KEY;
  const router = require("../routes")(app);

  let orderId = "";

  const setOrderId = (orderId: string): void => {
    //console.log("setOrderId()");
    orderId = orderId;
    app.locals.orderId = orderId;
  };

  const getOrderId = (): string => {
    return orderId;
  };

  if (!SIGNING_KEY || !API_KEY) {
    throw new Error("missing mandatory environment variable(s)");
  } else {
    const CHANNEL_NAMES = {
      // heartbeats: "heartbeats",
      // candles: "candles",
      // status: "status",
      // ticker: "ticker",
      // ticker_batch: "ticker_batch",
      // level2: "level2",
      user: "user",
      // market_trades: "market_trades",
    };

    // The base URL of the API
    const WS_API_URL = "wss://advanced-trade-ws.coinbase.com";

    // Function to generate a signature using CryptoJS
    const ws = new WebSocket(WS_API_URL);

    const subscribeToProducts = (
      products: string[],
      channelName: string,
      ws: WebSocket
    ) => {
      const message = {
        type: "subscribe",
        channel: channelName,
        api_key: API_KEY,
        product_ids: products,
      };
      // console.log("subscribeToProducts() - message=", message);
      const subscribeMsg = timestampAndSign(
        message,
        channelName,
        products,
        SIGNING_KEY
      );
      ws.send(JSON.stringify(subscribeMsg));
    };

    const unsubscribeToProducts = (
      products: string[],
      channelName: string,
      ws: WebSocket
    ) => {
      const message = {
        type: "unsubscribe",
        channel: channelName,
        api_key: API_KEY,
        product_ids: products,
      };
      const subscribeMsg = timestampAndSign(
        message,
        channelName,
        products,
        SIGNING_KEY
      );
      ws.send(JSON.stringify(subscribeMsg));
    };

    const connections: WebSocket[] = [];
    let price = "0";
    let sentUnsub = false;

    const date1 = new Date(new Date().toUTCString());
    const socket = new WebSocket(WS_API_URL);

    socket.on("message", function (rawData: WebSocket.RawData) {
      const date2 = new Date(new Date().toUTCString());
      const diffTime = Math.abs(Number(date2) - Number(date1));

      // if (diffTime > 5000 && !sentUnsub) {
      //   // unsubscribeToProducts(["SOL-USD", ], CHANNEL_NAMES.user, socket);
      //   Object.keys(CHANNEL_NAMES).forEach((channel) => {
      //     unsubscribeToProducts(["SOL-USD"], channel, socket);
      //   });
      //   sentUnsub = true;
      // }

      // @ts-ignore
      const data = JSON.parse(rawData);
      // console.log(data);
      const { channel } = data;

      // Channels
      if (channel) {
        // Heartbeats
        if (channel === "heartbeats") {
          // handleHeartBeat(data);
        }

        // Candles
        if (channel === "candles") {
          // handleCandles(data);
        }

        //  Status
        if (channel === "status") {
          handleStatus(data);
        }

        // Market Trades
        if (channel === "market_trades") {
          // handleMarketTrades(data);
        }
        // Ticker
        if (channel === "ticker") {
          handleTicker(data);
        }

        //  Ticket Batch
        if (channel === "ticker_batch") {
          handleTickerBatch(app, data);
        }

        // User
        if (channel === "user") {
          console.log("channel is USER");
          handleUser(app, data);
        }

        // Subscriptions
        if (channel === "subscriptions") {
          handleSubscriptions(data);
        }

        //  Ticket Batch
        if (channel === "l2_data") {
          handleLevel2(data);
        }
      }

      // fs.appendFile("Output1.txt", data, (err: unknown) => {
      //   // In case of a error throw err.
      //   if (err) throw err;
      // });
    });

    socket.on("open", function () {
      const products = ["SOL-USD"];
      Object.keys(CHANNEL_NAMES).forEach((channel) => {
        subscribeToProducts(products, channel, socket);
      });
    });

    connections.push(socket);
  }
};

export default websockets;
