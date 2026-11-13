import { SinistroRequest } from '../../dto/sinistro.dto.request';
import { SinistroResponse } from '../../dto/sinistro.dto.response';

export const CREATE_SINISTRO_USE_CASE = 'CREATE_SINISTRO_USE_CASE';

export interface CreateSinistroUseCase {
  execute(sinistro: SinistroRequest): Promise<SinistroResponse>;
}
