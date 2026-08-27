import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { BadRequestError } from '../domain/errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId: string;
  }
}

const tenantPluginImpl: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', async (request) => {
    const tenantId = request.headers['x-tenant-id'];

    if (typeof tenantId !== 'string' || tenantId.trim() === '') {
      throw new BadRequestError(
        'Header x-tenant-id is required',
        'TENANT_ID_REQUIRED',
      );
    }

    request.tenantId = tenantId;
  });
};

export const tenantPlugin = fp(tenantPluginImpl, {
  name: 'tenant-plugin',
});
