import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SinistroRequest } from '../../dto/sinistro.dto.request';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY, SinistroWriteRepository } from '../../../domain/ports/sinistro.write.repository';
import { LIMITE_REPAROS, TipoDefeitoEnum } from '../../../domain/value-objects/defeito.enum';
import { Status, StatusSinistroEnum } from '../../../domain/value-objects/status.value-object';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { UpdateSinistroUseCase } from '../../use-case/write/update.sinistro.use-case';

@Injectable()
export class UpdateSinistroService implements UpdateSinistroUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly readRepository: SinistroReadRepository,
    @Inject(SINISTRO_WRITE_REPOSITORY)
    private readonly writeRepository: SinistroWriteRepository,
  ) {}

  async execute(id: string, sinistro: SinistroRequest): Promise<SinistroResponse> {
    const existente = await this.readRepository.findSinistroById(id);

    if (!existente) {
      throw new NotFoundException('Sinistro não encontrado.');
    }

    if (sinistro.cliente !== undefined && !sinistro.cliente.trim()) {
      throw new BadRequestException('Informe o nome do cliente.');
    }
    if (sinistro.numeroSerie !== undefined && !sinistro.numeroSerie.trim()) {
      throw new BadRequestException('Informe o número de série do aparelho.');
    }
    if (sinistro.descricaoDefeito !== undefined && sinistro.descricaoDefeito.trim().length < 10) {
      throw new BadRequestException('Descreva o defeito com pelo menos 10 caracteres.');
    }

    try {
      if (sinistro.cliente !== undefined) existente.props.cliente = sinistro.cliente.trim();
      if (sinistro.dispositivo !== undefined) existente.props.dispositivo = sinistro.dispositivo.trim();
      if (sinistro.numeroSerie !== undefined) existente.props.numeroSerie = sinistro.numeroSerie.trim().toUpperCase();
      if (sinistro.descricaoDefeito !== undefined) existente.props.descricaoDefeito = sinistro.descricaoDefeito.trim();
      if (sinistro.laudo !== undefined) existente.props.laudo = sinistro.laudo;
      if (sinistro.tipoDefeito !== undefined) existente.atualizarDefeito(sinistro.tipoDefeito as TipoDefeitoEnum);

      if (sinistro.status !== undefined) {
        existente.props.status = Status.create(sinistro.status);
      }
    } catch (erro: any) {
      throw new BadRequestException(erro.message);
    }

    if (existente.props.status.isFinalizado()) {
      const laudo = existente.props.laudo ?? '';
      if (laudo.trim().length < 10) {
        throw new BadRequestException('Escreva o laudo (mínimo 10 caracteres) para finalizar o sinistro.');
      }
    }

    // aparelho que já foi reparado demais não volta como "reparado" de novo
    if (existente.props.status.value === StatusSinistroEnum.REPARADO) {
      const todos = await this.readRepository.findSinistroAll();
      const reparosAnteriores = todos.filter(
        (s) =>
          s.props.id !== existente.props.id &&
          s.props.numeroSerie === existente.props.numeroSerie &&
          s.props.status.value === StatusSinistroEnum.REPARADO,
      ).length;

      if (reparosAnteriores >= LIMITE_REPAROS) {
        existente.props.status = Status.substituido();
        existente.props.laudo = `${existente.props.laudo} (troca automática: aparelho já teve ${reparosAnteriores} reparos)`;
      }
    }

    existente.props.updateAt = new Date();

    const salvo = await this.writeRepository.updateSinistro(existente);
    return SinistroMapper.toSinistroResponseFromSinistroEntity(salvo);
  }
}
