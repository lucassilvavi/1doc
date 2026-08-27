import { Chip } from '@mui/material';
import type { StatusProcesso } from '../modules/processo/types.ts';

const labels: Record<StatusProcesso, string> = {
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

const colors: Record<StatusProcesso, 'warning' | 'success'> = {
  em_andamento: 'warning',
  concluido: 'success',
};

type StatusChipProps = {
  status: StatusProcesso;
};

export function StatusChip({ status }: StatusChipProps) {
  return <Chip label={labels[status]} color={colors[status]} size="small" />;
}
