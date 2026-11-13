export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001/v1';

export type TipoDefeito = 'TELA' | 'BATERIA' | 'PLACA' | 'CONECTOR' | 'SOFTWARE';
export type StatusSinistro = 'ABERTO' | 'EM_LABORATORIO' | 'REPARADO' | 'SUBSTITUIDO' | 'REPROVADO';

export interface Sinistro {
  id: string;
  cliente: string;
  dispositivo?: string;
  numeroSerie: string;
  tipoDefeito: TipoDefeito;
  descricaoDefeito: string;
  laudo?: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  status: StatusSinistro;
  createdAt?: string;
}

export interface SinistroFormData {
  cliente: string;
  dispositivo?: string;
  numeroSerie: string;
  tipoDefeito: TipoDefeito;
  descricaoDefeito: string;
  laudo?: string;
  status?: StatusSinistro;
}

export const DEFEITOS: { valor: TipoDefeito; nome: string }[] = [
  { valor: 'TELA', nome: 'Tela / display' },
  { valor: 'BATERIA', nome: 'Bateria' },
  { valor: 'PLACA', nome: 'Placa-mãe' },
  { valor: 'CONECTOR', nome: 'Conector / porta de carga' },
  { valor: 'SOFTWARE', nome: 'Software / firmware' },
];

export const STATUS_LISTA: { valor: StatusSinistro; nome: string }[] = [
  { valor: 'ABERTO', nome: 'Aberto' },
  { valor: 'EM_LABORATORIO', nome: 'No laboratório' },
  { valor: 'REPARADO', nome: 'Reparado' },
  { valor: 'SUBSTITUIDO', nome: 'Substituído' },
  { valor: 'REPROVADO', nome: 'Reprovado' },
];

async function tratar<T>(resposta: Response): Promise<T> {
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    throw new Error(corpo.message || 'Erro ao falar com o servidor.');
  }
  return resposta.json();
}

export async function listarSinistros(filtro?: string): Promise<Sinistro[]> {
  const query = filtro && filtro !== 'TODOS' ? `?status=${filtro}` : '';
  const resp = await fetch(`${API_URL}/sinistros${query}`, { cache: 'no-store' });
  return tratar<Sinistro[]>(resp);
}

export async function buscarSinistro(id: string): Promise<Sinistro> {
  const resp = await fetch(`${API_URL}/sinistros/${id}`, { cache: 'no-store' });
  return tratar<Sinistro>(resp);
}

export async function criarSinistro(dados: SinistroFormData): Promise<Sinistro> {
  const resp = await fetch(`${API_URL}/sinistros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return tratar<Sinistro>(resp);
}

export async function atualizarSinistro(id: string, dados: SinistroFormData): Promise<Sinistro> {
  const resp = await fetch(`${API_URL}/sinistros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return tratar<Sinistro>(resp);
}

export async function excluirSinistro(id: string): Promise<void> {
  const resp = await fetch(`${API_URL}/sinistros/${id}`, { method: 'DELETE' });
  await tratar(resp);
}
