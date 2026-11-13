import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';
import { SinistroWriteRepository } from '../../domain/ports/sinistro.write.repository';
import { SinistroMapper } from '../mappers/sinistro.mappers';

@Injectable()
export class SinistroPrismaWriteRepository implements SinistroWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSinistro(sinistroEntity: SinistroEntity): Promise<SinistroEntity> {
    const data = SinistroMapper.toSinistroFromSinistroEntity(sinistroEntity);
    const sinistroCreated = await this.prisma.sinistro.create({ data });
    return SinistroMapper.toSinistroEntityFromSinistroPrisma(sinistroCreated);
  }

  async updateSinistro(id: string, sinistroEntity: SinistroEntity): Promise<SinistroEntity> {
    const { id: _id, ...data } = SinistroMapper.toSinistroFromSinistroEntity(sinistroEntity);
    const sinistroUpdate = await this.prisma.sinistro.update({
      where: { id },
      data,
    });
    return SinistroMapper.toSinistroEntityFromSinistroPrisma(sinistroUpdate);
  }

  async deleteSinistro(id: string): Promise<void> {
    await this.prisma.sinistro.delete({ where: { id } });
  }
}
