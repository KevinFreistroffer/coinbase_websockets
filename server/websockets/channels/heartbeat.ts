// @ts-nocheck
export const handleHeartBeat = (data: unknown): void => {
  console.log("handleHeartBeat - ", data);
  const { channel, client_id, timestamp } = data;
  /**
   *  channel: 'heartbeats',
      client_id: '',
      timestamp: '2023-11-04T17:11:06.143405986Z',
      sequence_num: 29,
      events: [
        {
          current_time: '2023-11-04 17:11:06.142994456 +0000 UTC m=+80579.718691965',
          heartbeat_counter: 2685
        }
      ]
   */
};

export default handleHeartBeat;
