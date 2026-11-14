import { Estatisticas, Sinistro } from '../type/sinistro.type';
import { apiAutenticada } from '@/features/auth/api/auth.http';

// ETAPA 3 - Consultas do Next sempre enviam a sessao validada; sem acesso anonimo.
export async function fetchSinistros(): Promise<Sinistro[]> {
  const resposta = await apiAutenticada('/sinistro');
  if (!resposta.ok) throw new Error('Falha ao carregar sinistros.');
  return resposta.json() as Promise<Sinistro[]>;
}

export async function fetchEstatisticas(): Promise<Estatisticas> {
  const resposta = await apiAutenticada('/sinistro/estatisticas');
  if (!resposta.ok) throw new Error('Falha ao carregar estatísticas.');
  return resposta.json() as Promise<Estatisticas>;
}
