import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { env } from './env.js'; // adapte le chemin selon ton projet

const server = fastify({
  logger: true,
});

// Plugin registrations
async function buildServer() {
  await server.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Raw Ingester API',
        version: '1.0.0',
      },
    },
  });

  await server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Total-Count'],
    credentials: true,
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: (request, reply, next) => next(),
      preHandler: (request, reply, next) => next(),
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });

  server.post(
    '/push-raw',
    {
      schema: {
        body: {
          type: 'object',
          properties: {},
        },
        response: {
          200: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              metadata: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    url: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body;
      console.log('📩 🚲 Received raw data:', body);
      return { status: 'ok' };
    }
  );

  server.get('/health', async () => {
    return { status: 'ok' };
  });

  server.get('/', async () => {
    return { status: 'ok' };
  });

  return server;
}

let isReady = false;

// For local dev only
if (!process.env.VERCEL) {
  buildServer().then((srv) => {
    srv.listen({ port: env.INJESTER_API_PORT, host: env.INJESTER_API_HOST }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`✅ Server listening at ${address}`);
    });
  });
}

// Export Vercel-compatible handler
export default async function handler(req: any, res: any) {
  if (!isReady) {
    await buildServer();
    isReady = true;
  }

  server.server.emit('request', req, res);
}
