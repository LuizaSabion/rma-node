import { Estatisticas, Sinistro } from '../type/sinistro.type';

const API_URL = 'http://localhost:8000/v1/sinistro';

export async function fetchSinistros(): Promise<Sinistro[]> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    return await res.json();
  } catch (error: unknown) {
    console.error('erro ao carregar os sinistros', error);
    return [];
  }
}

export async function fetchEstatisticas(): Promise<Estatisticas | null> {
  try {
    const res = await fetch(`${API_URL}/estatisticas`, { cache: 'no-store' });
    return await res.json();
  } catch (error: unknown) {
    console.error('erro ao carregar as estatisticas', error);
    return null;
  }
}
