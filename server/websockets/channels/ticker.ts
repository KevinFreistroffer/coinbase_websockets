// @ts-nocheck
export const handleTicker = (data: unknown): void => {
  /**
   * 
   * channel: 'ticker',
  client_id: '',
  timestamp: '2023-11-04T16:41:07.286518713Z',
  sequence_num: 53,
  events: [ { type: 'update', tickers: [Array] } ]
   */
  const { events, timestamp, client_id } = data;

  if (events.length) {
    const eventType = events[0].type;
    const tickers = events[0].tickers;
    if (tickers.length) {
      // console.log("Channel = ticker - tickers=", tickers);

      if (tickers[0].product_id === "SOL-USD") {
        const price = tickers[0].price;
        console.log("Channel = ticker - SOL-USD price=", price);
      }
      /**
       *  {
    type: 'ticker',
    product_id: 'SOL-USD',
    price: '41.51',
    volume_24_h: '1692791.642',
    low_24_h: '38.52',
    high_24_h: '42.73',
    low_52_w: '8',
    high_52_w: '46.97',
    price_percent_chg_24_h: '4.90270406873894'
  }
       */
    }
  }
};

export default handleTicker;
