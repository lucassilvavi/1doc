import type { FastifyPluginAsync } from 'fastify';
import { ListProcessosUseCase } from './application/list-processos.use-case.js';
import type { ProcessoRepository } from './domain/ports/processo-repository.js';
import { processosRoutes } from './http/processos.routes.js';

export function createProcessosModule(processoRepository: ProcessoRepository) {
  const listProcessos = new ListProcessosUseCase(processoRepository);

  const routes: FastifyPluginAsync = async (app) => {
    await app.register(processosRoutes, { listProcessos });
  };

  return { listProcessos, routes };
}
