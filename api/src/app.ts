import Fastify from 'fastify';
import { createProcessosModule } from './modules/processos/processos.module.js';
import type { ProcessoRepository } from './modules/processos/domain/ports/processo-repository.js';
import { errorHandler } from './shared/http/error-handler.js';
import { tenantPlugin } from './shared/http/tenant-plugin.js';

export type AppDeps = {
  processoRepository: ProcessoRepository;
};

export type BuildAppOptions = {
  logger?: boolean;
};

export async function buildApp(deps: AppDeps, options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? false,
    ajv: {
      customOptions: {
        coerceTypes: true,
      },
    },
  });

  app.setErrorHandler(errorHandler);

  await app.register(tenantPlugin);

  const processos = createProcessosModule(deps.processoRepository);
  await app.register(processos.routes);

  return app;
}
