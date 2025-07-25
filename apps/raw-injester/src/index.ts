import fastify from 'fastify';
import { env } from './env.js';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const server = fastify({
  logger: true
});

await server.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Raw Ingester API',
      version: '1.0.0'
    }
  }
});

server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  credentials: true
});

server.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: (request, reply, next) => {
      next();
    },
    preHandler: (request, reply, next) => {
      next();
    }
  },
  staticCSP: true,
  transformStaticCSP: header => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true
});

server.post(
  '/push-raw',
  {
    schema: {
      body: {
        type: 'object',
        properties: {

        },

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
                  url: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  async (request, reply) => {
    const body = request.body;

    console.log('📩 🚲 Received raw data:', body);

    return { status: 'ok' };
  });

server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

server.listen({ port: env.INJESTER_API_PORT, host: env.INJESTER_API_HOST }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
