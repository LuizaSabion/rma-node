import { Injectable } from '@nestjs/common';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';
import { SinistroReadRepository } from '../../domain/ports/sinistro.read.repository';
import { SinistroMemoryStore } from '../store/sinistro.memory.store';

@Injectable()
export class SinistroMemoryReadRepository implements SinistroReadRepository {
  constructor(private readonly store: SinistroMemoryStore) {}

  async findSinistroAll(filtro?: string): Promise<SinistroEntity[]> {
    if (!filtro || filtro === 'TODOS') {
      return [...this.store.dados];
    }
    return this.store.dados.filter((s) => s.props.status.value === filtro);
  }

  async findSinistroById(id: string): Promise<SinistroEntity | null> {
    return this.store.dados.find((s) => s.props.id === id) ?? null;
  }
}
