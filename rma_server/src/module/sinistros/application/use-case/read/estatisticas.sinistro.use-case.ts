import { EstatisticasResponse } from '../../dto/sinistro.dto.response';

export const ESTATISTICAS_SINISTRO_USE_CASE = 'ESTATISTICAS_SINISTRO_USE_CASE';

export interface EstatisticasSinistroUseCase {
  execute(): Promise<EstatisticasResponse>;
}
