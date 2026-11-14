'use server';

import { revalidatePath } from 'next/cache';
import { LaudoFormData, SinistroFormData } from '../schema/sinistro.schema';
import { ActionState, Sinistro } from '../type/sinistro.type';

const API_URL = 'http://localhost:8000/v1/sinistro';

async function enviar(url: string, method: string, mensagemOk: string, body?: unknown): Promise<ActionState<Sinistro>> {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    // delete volta 204 sem body
    const data = response.status === 204 ? null : await response.json();

    if (!response.ok) {
      return {
        success: false,
        state: response.status,
        message: Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Erro ao gravar',
      };
    }

    revalidatePath('/sinistro');

    return { success: true, state: response.status, message: mensagemOk, data: data ?? undefined };
  } catch (error: any) {
    console.error('ERRO DETALHADO DO FETCH:', error.cause || error);
    return {
      success: false,
      message: 'falha na conexão com o servidor',
    };
  }
}

function montarCorpo(sinistro: SinistroFormData) {
  const { severidade, ...resto } = sinistro;
  return severidade ? { ...resto, severidade } : resto;
}

export async function createSinistro(
  prevState: ActionState,
  sinistro: SinistroFormData,
): Promise<ActionState<Sinistro>> {
  return enviar(API_URL, 'POST', 'Pedido de garantia aberto com sucesso', montarCorpo(sinistro));
}

export async function updateSinistro(
  prevState: ActionState,
  payload: { id: string; sinistro: SinistroFormData },
): Promise<ActionState<Sinistro>> {
  return enviar(`${API_URL}/${payload.id}`, 'PUT', 'Sinistro alterado com sucesso', montarCorpo(payload.sinistro));
}

export async function deleteSinistro(prevState: ActionState, id: string): Promise<ActionState<Sinistro>> {
  return enviar(`${API_URL}/${id}`, 'DELETE', 'Sinistro excluído');
}

export async function enviarLaboratorio(prevState: ActionState, id: string): Promise<ActionState<Sinistro>> {
  return enviar(`${API_URL}/${id}/enviar-laboratorio`, 'PATCH', 'Aparelho enviado ao laboratório');
}

// ETAPA 1 - A conclusão possui uma ação própria, sem enviar status arbitrário.
export async function concluirReparo(prevState: ActionState, id: string): Promise<ActionState<Sinistro>> {
  return enviar(`${API_URL}/${id}/concluir-reparo`, 'PATCH', 'Reparo concluído com sucesso');
}

export async function emitirLaudo(
  prevState: ActionState,
  payload: { id: string; laudo: LaudoFormData },
): Promise<ActionState<Sinistro>> {
  return enviar(`${API_URL}/${payload.id}/laudo`, 'PATCH', 'Laudo emitido', payload.laudo);
}
