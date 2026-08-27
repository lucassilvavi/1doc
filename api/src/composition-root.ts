import type { Processo } from './modules/processos/domain/processo.js';
import { InMemoryProcessoRepository } from './modules/processos/infrastructure/in-memory-processo-repository.js';
import type { AppDeps } from './app.js';

const seedProcessos: Processo[] = [
  {
    id: 'proc-1',
    tenantId: 'tenant-a',
    titulo: 'Abertura de conta',
    status: 'em_andamento',
  },
  {
    id: 'proc-2',
    tenantId: 'tenant-a',
    titulo: 'Análise de crédito',
    status: 'concluido',
  },
  {
    id: 'proc-3',
    tenantId: 'tenant-b',
    titulo: 'Onboarding',
    status: 'em_andamento',
  },
];

export function createCompositionRoot(): AppDeps {
  return {
    processoRepository: new InMemoryProcessoRepository(seedProcessos),
  };
}
