import { buildApp } from '../../../src/app.js';
import type { Processo } from '../../../src/modules/processos/domain/processo.js';
import { InMemoryProcessoRepository } from '../../../src/modules/processos/infrastructure/in-memory-processo-repository.js';

const seed: Processo[] = [
  {
    id: '1',
    tenantId: 'tenant-a',
    titulo: 'Abertura de conta',
    status: 'em_andamento',
  },
  {
    id: '2',
    tenantId: 'tenant-a',
    titulo: 'Análise de crédito',
    status: 'concluido',
  },
  {
    id: '3',
    tenantId: 'tenant-b',
    titulo: 'Onboarding',
    status: 'em_andamento',
  },
];

async function createTestApp(processos: Processo[] = seed) {
  return buildApp({
    processoRepository: new InMemoryProcessoRepository(processos),
  });
}

describe('GET /processos', () => {
  it('returns 400 when x-tenant-id is missing', async () => {
    const app = await createTestApp();

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/processos',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual(
        expect.objectContaining({
          statusCode: 400,
          error: 'TENANT_ID_REQUIRED',
          message: 'Header x-tenant-id is required',
        }),
      );
    } finally {
      await app.close();
    }
  });

  it('returns 400 when status is invalid', async () => {
    const app = await createTestApp();

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/processos?status=cancelado',
        headers: { 'x-tenant-id': 'tenant-a' },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual(
        expect.objectContaining({
          statusCode: 400,
          error: 'BAD_REQUEST',
        }),
      );
    } finally {
      await app.close();
    }
  });

  it('returns 200 with an empty list for a tenant without data', async () => {
    const app = await createTestApp();

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/processos',
        headers: { 'x-tenant-id': 'tenant-empty' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        data: [],
        total: 0,
        page: 1,
      });
    } finally {
      await app.close();
    }
  });

  it('filters by status and does not leak processos from other tenants', async () => {
    const app = await createTestApp();

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/processos?status=em_andamento',
        headers: { 'x-tenant-id': 'tenant-a' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        data: [
          {
            id: '1',
            tenantId: 'tenant-a',
            titulo: 'Abertura de conta',
            status: 'em_andamento',
          },
        ],
        total: 1,
        page: 1,
      });
    } finally {
      await app.close();
    }
  });

  it('returns data, total and page on 200', async () => {
    const app = await createTestApp();

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/processos',
        headers: { 'x-tenant-id': 'tenant-a' },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      expect(body).toEqual({
        data: [
          {
            id: '1',
            tenantId: 'tenant-a',
            titulo: 'Abertura de conta',
            status: 'em_andamento',
          },
          {
            id: '2',
            tenantId: 'tenant-a',
            titulo: 'Análise de crédito',
            status: 'concluido',
          },
        ],
        total: 2,
        page: 1,
      });
      expect(Array.isArray(body.data)).toBe(true);
      expect(typeof body.total).toBe('number');
      expect(typeof body.page).toBe('number');
    } finally {
      await app.close();
    }
  });
});
