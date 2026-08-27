export type StatusProcesso = 'em_andamento' | 'concluido';

export type Processo = {
  id: string;
  titulo: string;
  status: StatusProcesso;
};

export type ListProcessosResponse = {
  data: Processo[];
  total: number;
  page: number;
};
