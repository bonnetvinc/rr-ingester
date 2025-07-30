import fastify from 'fastify';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '@repo/database';

export type RawPassingInput = {
  ID: number;
  PID: number;
  TimingPoint: string;
  Result: number;
  Time: number;
  Invalid: boolean;
  Bib: number;
  Passing: {
    Transponder: string;
    Position: {
      Latitude: number;
      Longitude: number;
      Altitude: number;
      Flag: string;
    };
    Hits: number;
    RSSI: number;
    Battery: number;
    Temperature: number;
    WUC: number;
    LoopID: number;
    Channel: number;
    InternalData: string;
    StatusFlags: number;
    DeviceID: string;
    DeviceName: string;
    OrderID: number;
    Port: number;
    IsMarker: boolean;
    FileNo: number;
    PassingNo: number;
    Customer: number;
    Received: string;
    UTCTime: string;
  };
};

export async function saveRawPassing(input: RawPassingInput) {
  return db.rawPassing.create({
    data: {
      id: input.ID,
      pid: input.PID,
      timingPoint: input.TimingPoint,
      result: input.Result,
      time: input.Time,
      invalid: input.Invalid,
      bib: input.Bib,
      transponder: input.Passing.Transponder,
      hits: input.Passing.Hits,
      rssi: input.Passing.RSSI,
      battery: input.Passing.Battery,
      temperature: input.Passing.Temperature,
      wuc: input.Passing.WUC,
      loopId: input.Passing.LoopID,
      channel: input.Passing.Channel,
      internalData: input.Passing.InternalData,
      statusFlags: input.Passing.StatusFlags,
      deviceId: input.Passing.DeviceID,
      deviceName: input.Passing.DeviceName,
      orderId: input.Passing.OrderID,
      port: input.Passing.Port,
      isMarker: input.Passing.IsMarker,
      fileNo: input.Passing.FileNo,
      passingNo: input.Passing.PassingNo,
      customer: input.Passing.Customer,
      received: new Date(input.Passing.Received),
      utcTime: new Date(input.Passing.UTCTime),
      latitude: input.Passing.Position.Latitude,
      longitude: input.Passing.Position.Longitude,
      altitude: input.Passing.Position.Altitude,
      flag: input.Passing.Position.Flag
    }
  });
}

const server = fastify({
  logger: true
});

// Routes
server.get('/health', async () => {
  return { status: 'ok' };
});

server.post('/push-raw', async (request, reply) => {
  const body = request.body;
  console.log('📩 Received data:', body);
  await saveRawPassing(body as any);
  reply.status(200).send({ status: 'ok' });
});

// Singleton ready flag
let isReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isReady) {
    await server.ready();
    isReady = true;
  }
  if (!req.url) req.url = '/';
  if (!req.method) req.method = 'GET';
  server.server.emit('request', req, res);
}

if (process.env.VERCEL !== '1') {
  const port = Number(process.env.PORT ?? 8080);
  server.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 Fastify listening on ${address}`);
  });
}
