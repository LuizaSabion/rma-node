import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';
import { ArquivoComprovante, SinistroWriteRepository } from '../../domain/ports/sinistro.write.repository';

import { SinistroMapper, comprovanteResumoSelect } from '../mappers/sinistro.mappers';

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

  // ETAPA 3 - Atualizacao do laudo/reparo so acontece se o tecnico ainda for o responsavel.
  async updateSinistroComoTecnico(id: string, entidade: SinistroEntity, tecnicoId: string): Promise<SinistroEntity> {
    const { id: _id, ...data } = SinistroMapper.toSinistroFromSinistroEntity(entidade);
    const atualizado = await this.prisma.sinistro.updateMany({
      where: { id, tecnicoResponsavelId: tecnicoId }, data,
    });
    if (!atualizado.count) throw new ConflictException('Responsável técnico mudou. Atualize o sinistro.');
    const salvo = await this.prisma.sinistro.findUniqueOrThrow({ where: { id },
      include: { comprovante: { select: comprovanteResumoSelect }, tecnicoResponsavel: { select: { nome: true } } } });
    return SinistroMapper.toSinistroEntityFromSinistroPrisma(salvo);
  }

  // ETAPA 2 - Documento e status sao persistidos juntos.
  async anexarComprovante(id: string, entidade: SinistroEntity, arquivo: ArquivoComprovante): Promise<SinistroEntity> {
    const documento = entidade.props.comprovante!;
    await this.prisma.$transaction(async (tx) => {
      await tx.comprovanteGarantia.upsert({
        where: { sinistroId: id },
        create: {
          sinistroId: id,
          nomeArquivo: arquivo.nomeArquivo,
          tipoMime: arquivo.tipoMime,
          arquivo: arquivo.conteudo,
          dataCompra: documento.dataCompra,
          numeroDocumento: documento.numeroDocumento,
        },
        update: {
          nomeArquivo: arquivo.nomeArquivo,
          tipoMime: arquivo.tipoMime,
          arquivo: arquivo.conteudo,
          dataCompra: documento.dataCompra,
          numeroDocumento: documento.numeroDocumento,
          prazoGarantiaMeses: null,
          dataVencimento: null,
          confirmadoEm: null,
        },
      });
      await tx.sinistro.update({ where: { id }, data: { status: entidade.props.status.value } });
    });
    const salvo = await this.prisma.sinistro.findUniqueOrThrow({
      where: { id }, include: { comprovante: { select: comprovanteResumoSelect } },
    });
    return SinistroMapper.toSinistroEntityFromSinistroPrisma(salvo);
  }

  // ETAPA 2 - Garantia conferida, prazo calculado e decisao atualizados na mesma transacao.
  async confirmarGarantia(id: string, entidade: SinistroEntity): Promise<SinistroEntity> {
    const doc = entidade.props.comprovante!;
    await this.prisma.$transaction(async (tx) => {
      await tx.comprovanteGarantia.update({
        where: { sinistroId: id },
        data: {
          prazoGarantiaMeses: doc.prazoGarantiaMeses,
          dataVencimento: doc.dataVencimento,
          confirmadoEm: doc.confirmadoEm,
        },
      });
      await tx.sinistro.update({
        where: { id },
        data: { status: entidade.props.status.value, motivoReprovacao: entidade.props.motivoReprovacao },
      });
    });
    const salvo = await this.prisma.sinistro.findUniqueOrThrow({
      where: { id }, include: { comprovante: { select: comprovanteResumoSelect } },
    });
    return SinistroMapper.toSinistroEntityFromSinistroPrisma(salvo);
  }

  async deleteSinistro(id: string): Promise<void> {
    await this.prisma.sinistro.delete({ where: { id } });
  }
}
