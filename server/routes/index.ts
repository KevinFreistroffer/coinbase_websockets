import express, { Application } from "express";
import { createHMAC, createHeaders, createTimeInSeconds } from "../utils";

module.exports = (app: Application) => {
  app.use("/exchange-rates", require("./exchangeRates"));
  app.use("/place-order", require("./placeOrder")(app));
  app.use("/sell-order", require("./sellOrder"));
  app.use("/get-product", require("./getProduct"));
  app.use("/cancel-orders", require("./cancelOrders"));
};
