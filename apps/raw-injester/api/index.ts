import fastify from 'fastify';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const server = fastify({
  logger: true,
});

// Routes
server.get('/health', async () => {
  return { status: 'ok' };
});

server.post('/push-raw', async (request, reply) => {
  const body = request.body;
  console.log('📩 Received:', body);
  return { status: 'ok' };
});

// Singleton ready flag
let isReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isReady) {
    await server.ready();
    isReady = true;
  }

  // Fastify v5: assure-toi que `req.url` est bien définie
  if (!req.url) req.url = '/';
  if (!req.method) req.method = 'GET';

  // Route la requête dans le serveur Fastify
  server.server.emit('request', req, res);
}
