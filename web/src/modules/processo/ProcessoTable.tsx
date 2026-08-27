import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { StatusChip } from '../../components/StatusChip.tsx';
import type { Processo } from './types.ts';

type ProcessoTableProps = {
  processos: Processo[];
};

export function ProcessoTable({ processos }: ProcessoTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Lista de processos">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Nenhum processo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            processos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell>{processo.id}</TableCell>
                <TableCell>{processo.titulo}</TableCell>
                <TableCell>
                  <StatusChip status={processo.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
