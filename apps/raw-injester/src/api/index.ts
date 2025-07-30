import Fastify from 'fastify';

const app = Fastify({
  logger: true
});

// Exemple route santé
app.get('/health', async () => {
  return { status: 'ok' };
});

// Export pour Vercel
export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}

// Pour dev local (node src/api/index.ts)
if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT ?? 3000);
  app.listen({ port }).then(() => {
    console.log(`🚀 Fastify listening on http://localhost:${port}`);
  });
}
