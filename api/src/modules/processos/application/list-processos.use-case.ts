import type { Processo, StatusProcesso } from '../domain/processo.js';
import type { ProcessoRepository } from '../domain/ports/processo-repository.js';

export class ListProcessosUseCase {
  constructor(private readonly processoRepository: ProcessoRepository) {}

  async execute(input: {
    tenantId: string;
    status?: StatusProcesso;
    page?: number;
  }): Promise<{ data: Processo[]; total: number; page: number }> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const { items, total } = await this.processoRepository.list({
      tenantId: input.tenantId,
      status: input.status,
      page,
    });

    return { data: items, total, page };
  }
}
