import React from "react";
import "./App.css";
import {
  exchangeRates,
  placeOrder,
  sellOrder,
  getProduct,
  cancelOrders,
} from "./api/routes";
// import exchangeRates from "./api/routes/exchangeRates";
import resources from "./api/resources";
import { SIDE } from "./api/constants";

function App() {
  const handleBuyOrder = () => {
    // Place buy order logic goes here

    // placeOrder();
    placeOrder("SOL-USD");
    // placeOrder(resources.createOrder, SIDE.BUY, "SOL-USD", "10.0", "1");
    console.log("Buy order placed!");
  };

  const handleSellOrder = () => {
    // Place sell order logic goes here
    console.log("Sell order placed!");
    sellOrder("SOL-USD");
  };

  const getExchangeRates = () => {
    // Get exchange rates logic goes here
    exchangeRates();
    console.log("Exchange rates fetched!");
  };

  const getProductRequest = async () => {
    // Get exchange rates logic goes here
    await getProduct("SOL-USD");
    console.log("Exchange rates fetched!");
  };

  const cancelOrdersRequest = async () => {
    // Get exchange rates logic goes here
    await cancelOrders("SOL-USD");
    console.log("Exchange rates fetched!");
  };

  return (
    <div className="App">
      <div id="container">
        <div id="sidebar">
          <ul>
            <li>TEST!</li>
          </ul>
          <div id="a-div">A div that is a div</div>
        </div>
        <div id="main">
          <ul>
            <li>Main</li>
            <li>Main</li>
          </ul>
        </div>
      </div>
      {/* <div id="element-container">
        <button onClick={() => setShouldScale(!shouldScale)}>Scale</button>
        <button
          onClick={() => {
            setShouldSmooth(false);
            setShouldRotate(!shouldRotate);
          }}
        >
          Rotate
        </button>
        <button onClick={() => setShouldSmooth(!shouldSmooth)}>Smooth</button>
        <div
          id="element"
          style={{
            transform: `${shouldScale ? "scale(1.5)" : ""} ${
              shouldRotate ? "rotate(90deg)" : ""
            }`,
            borderRadius: shouldSmooth ? "50%" : "",
          }}
        ></div>
      </div>
      <div id="buttons">
        <button id="buy-button" onClick={handleBuyOrder}>
          Place buy order
        </button>
        <button id="sell-button" onClick={handleSellOrder}>
          Place sell order
        </button>
        <button id="rates-button" onClick={getExchangeRates}>
          Get Exchange Rates
        </button>{" "}
        <button id="get-product-button" onClick={getProductRequest}>
          Get SOL Product
        </button>{" "}
        <button id="cancel-orders-button" onClick={cancelOrdersRequest}>
          Cancel orders
        </button>
      </div> */}
    </div>
  );
}

export default App;
