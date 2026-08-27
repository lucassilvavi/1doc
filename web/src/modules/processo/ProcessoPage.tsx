import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { listProcessos } from './processo.service.ts';
import { ProcessoTable } from './ProcessoTable.tsx';
import type { Processo } from './types.ts';

export function ProcessoPage() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listProcessos();
        if (!cancelled) {
          setProcessos(data);
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível carregar os processos.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Processos
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress aria-label="Carregando processos" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ProcessoTable processos={processos} />
      )}
    </Box>
  );
}
