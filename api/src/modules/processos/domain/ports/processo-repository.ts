import type { Processo, StatusProcesso } from '../processo.js';

export type ListProcessosInput = {
  tenantId: string;
  status?: StatusProcesso;
  page: number;
};

export type ListProcessosResult = {
  items: Processo[];
  total: number;
};

export interface ProcessoRepository {
  list(input: ListProcessosInput): Promise<ListProcessosResult>;
}
