import { ListProcessosUseCase } from '../../../../src/modules/processos/application/list-processos.use-case.js';
import type { Processo } from '../../../../src/modules/processos/domain/processo.js';
import type {
  ListProcessosInput,
  ListProcessosResult,
  ProcessoRepository,
} from '../../../../src/modules/processos/domain/ports/processo-repository.js';

const PAGE_SIZE = 20;

class FakeProcessoRepository implements ProcessoRepository {
  constructor(private readonly processos: Processo[]) {}

  async list(input: ListProcessosInput): Promise<ListProcessosResult> {
    let filtered = this.processos.filter(
      (processo) => processo.tenantId === input.tenantId,
    );

    if (input.status) {
      filtered = filtered.filter(
        (processo) => processo.status === input.status,
      );
    }

    const total = filtered.length;
    const start = (input.page - 1) * PAGE_SIZE;
    const items = filtered.slice(start, start + PAGE_SIZE);

    return { items, total };
  }
}

function processo(
  overrides: Partial<Processo> & Pick<Processo, 'id'>,
): Processo {
  return {
    tenantId: 'tenant-a',
    titulo: `Processo ${overrides.id}`,
    status: 'em_andamento',
    ...overrides,
  };
}

describe('ListProcessosUseCase', () => {
  const seed: Processo[] = [
    processo({ id: '1', tenantId: 'tenant-a', status: 'em_andamento' }),
    processo({ id: '2', tenantId: 'tenant-a', status: 'concluido' }),
    processo({ id: '3', tenantId: 'tenant-b', status: 'em_andamento' }),
    ...Array.from({ length: 21 }, (_, index) =>
      processo({
        id: `page-${index + 1}`,
        tenantId: 'tenant-c',
        status: 'em_andamento',
      }),
    ),
  ];

  const useCase = new ListProcessosUseCase(new FakeProcessoRepository(seed));

  it('filters by tenant and ignores processos from other tenants', async () => {
    const result = await useCase.execute({ tenantId: 'tenant-a' });

    expect(result.total).toBe(2);
    expect(result.data.map((item) => item.id)).toEqual(['1', '2']);
    expect(result.data.every((item) => item.tenantId === 'tenant-a')).toBe(
      true,
    );
  });

  it('filters by status when provided', async () => {
    const result = await useCase.execute({
      tenantId: 'tenant-a',
      status: 'concluido',
    });

    expect(result.total).toBe(1);
    expect(result.data).toEqual([
      expect.objectContaining({ id: '2', status: 'concluido' }),
    ]);
  });

  it('paginates results and defaults page to 1', async () => {
    const firstPage = await useCase.execute({ tenantId: 'tenant-c' });

    expect(firstPage.page).toBe(1);
    expect(firstPage.total).toBe(21);
    expect(firstPage.data).toHaveLength(20);

    const secondPage = await useCase.execute({ tenantId: 'tenant-c', page: 2 });

    expect(secondPage.page).toBe(2);
    expect(secondPage.total).toBe(21);
    expect(secondPage.data).toHaveLength(1);
    expect(secondPage.data[0]?.id).toBe('page-21');
  });
});
