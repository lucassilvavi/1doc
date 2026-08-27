import type { FastifyPluginAsync } from 'fastify';
import type { ListProcessosUseCase } from '../application/list-processos.use-case.js';
import {
  listProcessosSchema,
  type ListProcessosQuery,
} from './processos.schema.js';

export type ProcessosRoutesOptions = {
  listProcessos: ListProcessosUseCase;
};

export const processosRoutes: FastifyPluginAsync<ProcessosRoutesOptions> = async (
  app,
  opts,
) => {
  app.get<{ Querystring: ListProcessosQuery }>(
    '/processos',
    { schema: listProcessosSchema },
    async (request) => {
      return opts.listProcessos.execute({
        tenantId: request.tenantId,
        status: request.query.status,
        page: request.query.page ?? 1,
      });
    },
  );
};
