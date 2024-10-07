// @ts-nocheck
export const handleSubscriptions = (data: unknown): void => {
  // console.log("Channel = subscriptions - data=", data);
  // console.log("handleSubscriptions - ", data);
  const { events, timestamp } = data;
  if (events.length) {
    const subscriptions = events[0].subscriptions;
    /**
     *  {
          heartbeats: [ 'heartbeats' ],
          level2: [ 'SOL-USD' ],
          market_trades: [ 'SOL-USD' ],
          ticker: [ 'SOL-USD' ],
          ticker_batch: [ 'SOL-USD' ],
          user: [ '0bc25185-12d1-57ce-bfe3-bfb58a09f29e' ]
        }
     */
  }
};

export default handleSubscriptions;
