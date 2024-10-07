// @ts-nocheck
// Shows everyone's bids and offers.
export const handleLevel2 = (data: unknown): void => {
  console.log("Channel = level2", data.events[0]);
  const { events, timestamp, client_id } = data;
  /**
   * channel: 'l2_data',
  client_id: '',
  timestamp: '2023-11-04T17:03:44.011750157Z',
  sequence_num: 9,
  events: [ { type: 'snapshot', product_id: 'SOL-USD', updates: [Array] } ]
   */

  if (events.length) {
    const eventType = events[0].type;
    const product_id = events[0].product_id;
    const updates = events[0].updates;
    if (updates.length) {
      /**
       * [ {
            side: 'bid',
            event_time: '2023-11-04T17:06:57.027274Z',
            price_level: '41.61',
            new_quantity: '615.746'
          },
          {
            side: 'offer',
            event_time: '2023-11-04T17:06:57.027274Z',
            price_level: '41.65',
            new_quantity: '567.567'
          },]
       */
    }
  }
};

export default handleLevel2;
