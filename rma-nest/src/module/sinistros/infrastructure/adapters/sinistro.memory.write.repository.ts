import { Injectable } from '@nestjs/common';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';
import { SinistroWriteRepository } from '../../domain/ports/sinistro.write.repository';
import { SinistroMemoryStore } from '../store/sinistro.memory.store';

@Injectable()
export class SinistroMemoryWriteRepository implements SinistroWriteRepository {
  constructor(private readonly store: SinistroMemoryStore) {}

  async createSinistro(sinistroEntity: SinistroEntity): Promise<SinistroEntity> {
    this.store.dados.push(sinistroEntity);
    return sinistroEntity;
  }

  async updateSinistro(sinistroEntity: SinistroEntity): Promise<SinistroEntity> {
    const indice = this.store.dados.findIndex((s) => s.props.id === sinistroEntity.props.id);

    if (indice === -1) {
      throw new Error('Sinistro não encontrado.');
    }

    this.store.dados[indice] = sinistroEntity;
    return sinistroEntity;
  }

  async deleteSinistro(id: string): Promise<void> {
    this.store.dados = this.store.dados.filter((s) => s.props.id !== id);
  }
}
