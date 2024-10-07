// @ts-nocheck
export const handleStatus = (data: unknown): void => {
  console.log("Channel = status - data=", data);
  const { channel, client_id, timestamp, sequence_num, events } = data;

  if (events.length) {
    const eventType = events[0].type;
    const products = events[0].products;
    if (products.length) {
      console.log("Channel = status - products=", products);
      /**
       * [
       *  {
          product_type: 'SPOT',
          id: 'SOL-USD',
          base_currency: 'SOL',
          quote_currency: 'USD',
          base_increment: '0.001',
          quote_increment: '0.01',
          display_name: 'SOL/USD',
          status: 'online',
          status_message: '',
          min_market_funds: '1'
        }]
       */
    }
  }
  /**
   * {
      channel: 'status',
      client_id: '',
      timestamp: '2023-11-04T17:13:23.122322547Z',
      sequence_num: 3,
      events: [ { type: 'snapshot', products: [Array] } ]
    }
   */
};

export default handleStatus;
