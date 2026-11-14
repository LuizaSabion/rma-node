import { SinistroFormData } from '../schema/sinistro.schema';

// ETAPA 1 - Novo estado sincronizado com API e Prisma.
export type StatusSinistro = 'ABERTO' | 'EM_LABORATORIO' | 'EM_REPARO' | 'REPARADO' | 'SUBSTITUIDO' | 'REPROVADO';
export type TipoDefeito = 'TELA' | 'BATERIA' | 'PLACA' | 'CONECTOR' | 'SOFTWARE';
export type Severidade = 'ALTA' | 'MEDIA' | 'BAIXA';

export type Sinistro = {
  id: string;
  cliente: string;
  dispositivo: string;
  numeroSerie: string;
  tipoDefeito: TipoDefeito;
  tipoDefeitoNome: string;
  descricaoDefeito: string;
  severidade: Severidade;
  status: StatusSinistro;
  laudo: string;
  createdAt: string;
  updateAt: string | null;
};

export type Estatisticas = {
  total: number;
  abertos: number;
  laboratorio: number;
  emReparo: number;
  reparados: number;
  substituidos: number;
  reprovados: number;
};

export type Feedback = { type: 'success' | 'error'; message: string };

export interface SinistroFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sinistroEdit: (SinistroFormData & { id: string }) | null;
  onFeedback: (feedback: Feedback) => void;
}

export interface SinistroActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sinistro: Sinistro | null;
  onFeedback: (feedback: Feedback) => void;
}

export interface ActionState<T = unknown> {
  state?: number;
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export const InitialActionSinistroState: ActionState<Sinistro> = {
  state: 0,
  success: false,
  message: '',
  data: undefined,
  errors: undefined,
};

export const NOMES_STATUS: Record<StatusSinistro, string> = {
  ABERTO: 'Aberto',
  EM_LABORATORIO: 'No laboratório',
  EM_REPARO: 'Em reparo',
  REPARADO: 'Reparado',
  SUBSTITUIDO: 'Substituído',
  REPROVADO: 'Reprovado',
};

export const NOMES_DEFEITO: Record<TipoDefeito, string> = {
  TELA: 'Tela / display',
  BATERIA: 'Bateria',
  PLACA: 'Placa-mãe',
  CONECTOR: 'Conector / porta de carga',
  SOFTWARE: 'Software / firmware',
};

export const NOMES_SEVERIDADE: Record<Severidade, string> = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
};
