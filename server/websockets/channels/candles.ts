// @ts-nocheck
export const handleCandles = (data: unknown): void => {
  console.log("Channel = candles", data);
  const { events, timestamp, client_id } = data;
  console.log("Channel = candles - events=", events[0].candles);

  /**
   * {
      channel: 'candles',
      client_id: '',
      timestamp: '2023-11-04T17:08:37.534182717Z',
      sequence_num: 11,
      events: [ { type: 'update', candles: [Array] } ]
    }
   */

  if (events.length) {
    const eventType = events[0].type;
    const candles = events[0].candles;
    if (candles.length) {
      // console.log("candles - ", candles);
      /**
       * [{
            start: '1699008000',
            high: '38.44',
            low: '38.1',
            open: '38.15',
            close: '38.41',
            volume: '2359.757',
            product_id: 'SOL-USD'
          },
          {
            start: '1699011000',
            high: '38.97',
            low: '38.78',
            open: '38.87',
            close: '38.9',
            volume: '3217.998',
            product_id: 'SOL-USD'
          },]
       */
    }
  }
};

export default handleCandles;
