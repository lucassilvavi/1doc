export type StatusProcesso = 'em_andamento' | 'concluido';

export type Processo = {
  id: string;
  tenantId: string;
  titulo: string;
  status: StatusProcesso;
};
