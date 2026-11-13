import { Inject, Injectable } from '@nestjs/common';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { FindAllSinistroUseCase } from '../../use-case/read/findall.sinistro.use-case';

const PESO_SEVERIDADE: Record<string, number> = { ALTA: 0, MEDIA: 1, BAIXA: 2 };

@Injectable()
export class FindAllSinistroService implements FindAllSinistroUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly repository: SinistroReadRepository,
  ) {}

  async execute(filtro?: string): Promise<SinistroResponse[]> {
    const lista = await this.repository.findSinistroAll(filtro);

    // mais grave primeiro, e o mais antigo na frente dentro da mesma severidade
    const ordenada = [...lista].sort((a, b) => {
      const dif = PESO_SEVERIDADE[a.props.severidade.value] - PESO_SEVERIDADE[b.props.severidade.value];
      if (dif !== 0) return dif;
      return (a.props.createdAt?.getTime() ?? 0) - (b.props.createdAt?.getTime() ?? 0);
    });

    return SinistroMapper.toListSinistroResponseFromListSinistroEntity(ordenada);
  }
}
