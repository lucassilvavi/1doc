import type { ListProcessosResponse, Processo } from './types.ts';

const TENANT_ID = 'tenant-a';

export async function listProcessos(): Promise<Processo[]> {
  const response = await fetch('/processos', {
    headers: {
      'x-tenant-id': TENANT_ID,
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao carregar processos');
  }

  const body = (await response.json()) as ListProcessosResponse;
  return body.data;
}
