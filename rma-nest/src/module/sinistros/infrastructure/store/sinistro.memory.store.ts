import { Injectable } from '@nestjs/common';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';

// no lugar do banco: um array só, compartilhado pelos dois repositórios
@Injectable()
export class SinistroMemoryStore {
  dados: SinistroEntity[] = [];
}
