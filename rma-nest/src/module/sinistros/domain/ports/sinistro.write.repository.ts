import { SinistroEntity } from '../entity/sinistro.entity';

export const SINISTRO_WRITE_REPOSITORY = 'SINISTRO_WRITE_REPOSITORY';

export interface SinistroWriteRepository {
  createSinistro(sinistroEntity: SinistroEntity): Promise<SinistroEntity>;
  updateSinistro(sinistroEntity: SinistroEntity): Promise<SinistroEntity>;
  deleteSinistro(id: string): Promise<void>;
}
