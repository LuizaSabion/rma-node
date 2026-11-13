import { SinistroRequest } from '../../dto/sinistro.dto.request';
import { SinistroResponse } from '../../dto/sinistro.dto.response';

export const UPDATE_SINISTRO_USE_CASE = 'UPDATE_SINISTRO_USE_CASE';

export interface UpdateSinistroUseCase {
  execute(id: string, sinistro: SinistroRequest): Promise<SinistroResponse>;
}
