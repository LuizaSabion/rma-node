import { SinistroResponse } from '../../dto/sinistro.dto.response';

// ETAPA 1 - Contrato para a ação específica de conclusão (sem status livre no formulário).
export const CONCLUIR_REPARO_USE_CASE = 'CONCLUIR_REPARO_USE_CASE';

export interface ConcluirReparoUseCase {
  execute(id: string, usuarioId: string): Promise<SinistroResponse>;
}
