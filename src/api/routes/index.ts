export const exchangeRates = async () => {
  try {
    const response = fetch("http://localhost:8000/exchange-rates");

    return (await response).json();
  } catch (error) {
    console.log(error);
  }
};

export const placeOrder = async (product: string) => {
  try {
    const response = fetch("http://localhost:8000/place-order/" + product);
    return (await response).json();
  } catch (error) {
    console.log(error);
  }
};

export const sellOrder = async (product: string) => {
  try {
    const response = fetch(`http://localhost:8000/sell-order/${product}`);
    return (await response).json();
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (product: string) => {
  try {
    const response = fetch(`http://localhost:8000/get-product/${product}`);
    return (await response).json();
  } catch (error) {
    console.log(error);
  }
};

export const cancelOrders = async (product: string) => {
  try {
    const response = fetch(`http://localhost:8000/cancel-orders/${product}`);
    return (await response).json();
  } catch (error) {
    console.log(error);
  }
};
