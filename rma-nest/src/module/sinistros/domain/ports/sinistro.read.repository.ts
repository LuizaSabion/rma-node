import { SinistroEntity } from '../entity/sinistro.entity';

export const SINISTRO_READ_REPOSITORY = 'SINISTRO_READ_REPOSITORY';

export interface SinistroReadRepository {
  findSinistroAll(filtro?: string): Promise<SinistroEntity[]>;
  findSinistroById(id: string): Promise<SinistroEntity | null>;
}
