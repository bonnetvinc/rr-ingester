import fastify from 'fastify';

const app = fastify();

app.get('/health', async () => {
  return { status: 'ok' };
});

let isReady = false;

async function ensureReady() {
  if (!isReady) {
    await app.ready();
    isReady = true;
  }
}

// Handler pour Vercel
export default async function handler(req: any, res: any) {
  console.log('🔍 Requête reçue :', req.url);
  await ensureReady();
  app.server.emit('request', req, res);
}