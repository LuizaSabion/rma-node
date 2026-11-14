import { SinistroFormData } from '../schema/sinistro.schema';

// ETAPA 1 - Novo estado sincronizado com API e Prisma.
export type StatusSinistro = 'PENDENTE_COMPROVACAO' | 'ABERTO' | 'EM_LABORATORIO' | 'EM_REPARO' | 'REPARADO' | 'SUBSTITUIDO' | 'REPROVADO';
export type TipoDefeito = 'TELA' | 'BATERIA' | 'PLACA' | 'CONECTOR' | 'SOFTWARE';
export type Severidade = 'ALTA' | 'MEDIA' | 'BAIXA';
// ETAPA 2 - Categorias de garantia definidas para o sistema.
export type TipoDispositivo = 'FONE_COM_FIO' | 'CELULAR' | 'FONE_BLUETOOTH' | 'NOTEBOOK';
export const NOMES_TIPO_DISPOSITIVO: Record<TipoDispositivo, string> = {
  FONE_COM_FIO: 'Fone com fio (6 meses)',
  CELULAR: 'Celular (12 meses)',
  FONE_BLUETOOTH: 'Fone Bluetooth (12 meses)',
  NOTEBOOK: 'Notebook (24 meses)',
};

export type Sinistro = {
  id: string;
  cliente: string;
  dispositivo: string;
  // ETAPA 2 - Comprovante e metadados, sem devolver o arquivo na listagem.
  tipoDispositivo: TipoDispositivo | null;
  comprovanteAnexado: boolean;
  comprovanteNome: string | null;
  comprovanteConferidoEm: string | null;
  dataCompra: string | null;
  dataVencimento: string | null;
  prazoGarantiaMeses: number | null;
  motivoReprovacao: string | null;
  // ETAPA 3 - Responsavel tecnico confirmado pelo backend.
  tecnicoResponsavelId: string | null;
  tecnicoResponsavelNome: string | null;
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
  pendentes: number;
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
  // ETAPA 2 - Os novos sinistros aguardam a conferencia da nota fiscal.
  PENDENTE_COMPROVACAO: 'Pendente de comprovante',
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
