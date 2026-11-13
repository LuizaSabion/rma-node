import { SinistroResponse } from '../../dto/sinistro.dto.response';

export const FIND_BY_ID_SINISTRO_USE_CASE = 'FIND_BY_ID_SINISTRO_USE_CASE';

export interface FindByIdSinistroUseCase {
  execute(id: string): Promise<SinistroResponse>;
}
