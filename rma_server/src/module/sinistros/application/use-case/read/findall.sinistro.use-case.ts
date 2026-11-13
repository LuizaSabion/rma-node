import { SinistroResponse } from '../../dto/sinistro.dto.response';

export const FIND_ALL_SINISTRO_USE_CASE = 'FIND_ALL_SINISTRO_USE_CASE';

export interface FindAllSinistroUseCase {
  execute(status?: string): Promise<SinistroResponse[]>;
}
