import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';
import { SinistroReadRepository } from '../../domain/ports/sinistro.read.repository';
import { SinistroStatusEnum } from '../../domain/value-objects/status.value.object';
import { SinistroMapper, comprovanteResumoSelect } from '../mappers/sinistro.mappers';

@Injectable()
export class SinistroPrismaReadRepository implements SinistroReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSinistroAll(status?: SinistroStatusEnum): Promise<SinistroEntity[]> {
    const sinistros = await this.prisma.sinistro.findMany({
      where: status ? { status } : {},
      include: { comprovante: { select: comprovanteResumoSelect }, tecnicoResponsavel: { select: { nome: true } } },
      // ALTA primeiro, depois os mais antigos
      orderBy: [{ severidade: 'asc' }, { createdAt: 'asc' }],
    });
    return SinistroMapper.toListSinistroEntityFromListSinistro(sinistros);
  }

  async findSinistroById(id: string): Promise<SinistroEntity | null> {
    const sinistro = await this.prisma.sinistro.findUnique({ where: { id }, include: { comprovante: { select: comprovanteResumoSelect } } });
    return sinistro ? SinistroMapper.toSinistroEntityFromSinistroPrisma(sinistro) : null;
  }

  countReparos(numeroSerie: string): Promise<number> {
    return this.prisma.sinistro.count({
      where: { numeroSerie, status: SinistroStatusEnum.REPARADO },
    });
  }

  async countByStatus(): Promise<Record<SinistroStatusEnum, number>> {
    const grupos = await this.prisma.sinistro.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const resultado = {} as Record<SinistroStatusEnum, number>;
    for (const status of Object.values(SinistroStatusEnum)) {
      resultado[status] = 0;
    }
    for (const grupo of grupos) {
      resultado[grupo.status as SinistroStatusEnum] = grupo._count._all;
    }
    return resultado;
  }
}
