import type { Processo } from '../domain/processo.js';
import type {
  ListProcessosInput,
  ProcessoRepository,
} from '../domain/ports/processo-repository.js';

export const PROCESSOS_PAGE_SIZE = 20;

export class InMemoryProcessoRepository implements ProcessoRepository {
  constructor(private readonly processos: Processo[] = []) {}

  async list(input: ListProcessosInput): Promise<{
    items: Processo[];
    total: number;
  }> {
    let filtered = this.processos.filter(
      (processo) => processo.tenantId === input.tenantId,
    );

    if (input.status) {
      filtered = filtered.filter(
        (processo) => processo.status === input.status,
      );
    }

    const total = filtered.length;
    const start = (input.page - 1) * PROCESSOS_PAGE_SIZE;
    const items = filtered.slice(start, start + PROCESSOS_PAGE_SIZE);

    return { items, total };
  }
}
