'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiAutenticada, API_BASE, COOKIE_NOME, tokenAtual } from './auth.http';
import type { Perfil } from '../type/auth.type';

type Retorno = { erro: string };

// ETAPA 3 - O formulario nao grava tokens em localStorage; apenas o servidor configura cookie HttpOnly.
export async function entrar(_estado: Retorno, dados: FormData): Promise<Retorno> {
  try {
    const resposta = await fetch(`${API_BASE}/auth/login`, { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dados.get('email'), senha: dados.get('senha') }),
      cache: 'no-store',
    });
    const retorno = await resposta.json();
    if (!resposta.ok) return { erro: retorno?.message ?? 'Falha no login.' };
    (await cookies()).set(COOKIE_NOME, retorno.token, { httpOnly: true, sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
  } catch { return { erro: 'Não foi possível conectar ao backend.' }; }
  redirect('/sinistro');
}

export async function sair() {
  const token = await tokenAtual();
  if (token) {
    try { await apiAutenticada('/auth/logout', { method: 'POST' }); } catch { /* cookie será limpo mesmo offline */ }
  }
  (await cookies()).delete(COOKIE_NOME);
  redirect('/login');
}

export async function cadastrarUsuario(dados: FormData) {
  const resposta = await apiAutenticada('/auth/usuarios', { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: dados.get('nome'), email: dados.get('email'), senha: dados.get('senha'), perfil: dados.get('perfil') }),
  });
  const resultado = await resposta.json();
  if (!resposta.ok) return { ok: false, mensagem: resultado?.message ?? 'Erro ao cadastrar.' };
  revalidatePath('/usuarios');
  return { ok: true, mensagem: 'Usuário cadastrado.' };
}

export async function editarUsuario(id: string, alteracoes: { perfil?: Perfil; ativo?: boolean }) {
  const resposta = await apiAutenticada(`/auth/usuarios/${id}`, { method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(alteracoes),
  });
  const resultado = await resposta.json();
  if (!resposta.ok) return { ok: false, mensagem: resultado?.message ?? 'Falha ao alterar.' };
  revalidatePath('/usuarios');
  return { ok: true, mensagem: 'Usuário atualizado.' };
}
