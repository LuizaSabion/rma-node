import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Tecnico, Usuario, UsuarioCadastro } from '../type/auth.type';

export const API_BASE = 'http://localhost:8000/v1';
const COOKIE_NOME = 'rma_sessao';

// ETAPA 3 - Next guarda a sessao em cookie HttpOnly; o token nunca é passado a componentes client.
export async function tokenAtual() {
  return (await cookies()).get(COOKIE_NOME)?.value;
}

export async function apiAutenticada(caminho: string, opcoes: RequestInit = {}): Promise<Response> {
  const token = await tokenAtual();
  if (!token) throw new Error('Faça login para continuar.');
  const headers = new Headers(opcoes.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_BASE}${caminho}`, { ...opcoes, headers, cache: 'no-store' });
}

export async function usuarioLogado(): Promise<Usuario> {
  const token = await tokenAtual();
  if (!token) redirect('/login');
  let resposta: Response;
  try { resposta = await apiAutenticada('/auth/me'); }
  catch { throw new Error('Não foi possível consultar a autenticação. Confira o backend.'); }
  if (resposta.status === 401) redirect('/login');
  if (!resposta.ok) throw new Error('Erro ao consultar usuário.');
  return resposta.json() as Promise<Usuario>;
}

export async function buscarTecnicos(): Promise<Tecnico[]> {
  const resposta = await apiAutenticada('/auth/tecnicos');
  if (!resposta.ok) throw new Error('Falha ao carregar técnicos.');
  return resposta.json() as Promise<Tecnico[]>;
}

export async function buscarUsuarios(): Promise<UsuarioCadastro[]> {
  const resposta = await apiAutenticada('/auth/usuarios');
  if (!resposta.ok) throw new Error('Falha ao carregar usuários.');
  return resposta.json() as Promise<UsuarioCadastro[]>;
}

export { COOKIE_NOME };
