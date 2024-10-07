// @ts-nocheck
// Is everyones market trades
export const handleMarketTrades = (data: unknown): void => {
  console.log("Market trades - ", data);
  const { events, timestamp, client_id } = data;

  if (events.length) {
    const eventType = events[0].type;
    const trades = events[0].trades;
    if (trades.length) {
      // console.log("trades - ", trades);
    }
  }
};

export default handleMarketTrades;
