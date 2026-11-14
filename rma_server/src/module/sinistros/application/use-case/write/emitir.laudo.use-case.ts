import { LaudoRequest } from '../../dto/sinistro.dto.request';
import { SinistroResponse } from '../../dto/sinistro.dto.response';

export const EMITIR_LAUDO_USE_CASE = 'EMITIR_LAUDO_USE_CASE';

export interface EmitirLaudoUseCase {
  execute(id: string, laudo: LaudoRequest, usuarioId: string): Promise<SinistroResponse>;
}
