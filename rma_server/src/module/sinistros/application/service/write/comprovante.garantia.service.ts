import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NaoEncontradoError, RegraNegocioError } from '../../../../../shared/domain/errors/domain.errors';
import { validarDataCompra } from '../../../domain/value-objects/garantia.value.object';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY, SinistroWriteRepository } from '../../../domain/ports/sinistro.write.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { SinistroResponse } from '../../dto/sinistro.dto.response';

export type ArquivoRecebido = { originalname: string; mimetype: string; buffer: Buffer; size: number };

@Injectable()
export class ComprovanteGarantiaService {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY) private readonly leitura: SinistroReadRepository,
    @Inject(SINISTRO_WRITE_REPOSITORY) private readonly escrita: SinistroWriteRepository,
  ) {}

  // ETAPA 2 - A conferência NÃO acontece no upload; o atendente deve confirmá-la.
  async anexar(id: string, arquivo: ArquivoRecebido | undefined, dataCompra: string, numeroDocumento?: string): Promise<SinistroResponse> {
    if (!arquivo || !arquivo.buffer?.length) throw new BadRequestException('Selecione uma foto ou PDF do comprovante.');
    if (arquivo.size > 5 * 1024 * 1024) throw new BadRequestException('O arquivo deve ter no maximo 5 MB.');

    // ETAPA 2 - Conferimos a assinatura binaria, nao apenas a extensao enviada.
    const b = arquivo.buffer;
    const pdf = arquivo.mimetype === 'application/pdf' && b.subarray(0, 5).toString() === '%PDF-';
    const png = arquivo.mimetype === 'image/png' && b.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
    const jpg = arquivo.mimetype === 'image/jpeg' && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    if (!pdf && !png && !jpg) throw new BadRequestException('Envie somente PDF, PNG ou JPG valido.');

    const entidade = await this.leitura.findSinistroById(id);
    if (!entidade) throw new NaoEncontradoError('Sinistro nao encontrado.');
    const data = validarDataCompra(dataCompra);
    const numero = (numeroDocumento ?? '').trim();
    if (numero.length > 60) throw new RegraNegocioError('O numero do documento deve ter no maximo 60 caracteres.');
    // O numero e opcional para comprovante equivalente sem numero de NF.
    entidade.anexarComprovante({
      nomeArquivo: arquivo.originalname.replace(/[\/\\]/g, '_').slice(0, 150),
      dataCompra: data, numeroDocumento: numero || null, prazoGarantiaMeses: null,
      dataVencimento: null, confirmadoEm: null,
    });
    const salvo = await this.escrita.anexarComprovante(id, entidade, {
      nomeArquivo: entidade.props.comprovante!.nomeArquivo,
      tipoMime: arquivo.mimetype, conteudo: arquivo.buffer,
    });
    return SinistroMapper.toSinistroResponseFromSinistroEntity(salvo);
  }

  // ETAPA 2 - O backend calcula o prazo apos o atendente conferir os dados.
  async confirmar(id: string): Promise<SinistroResponse> {
    const entidade = await this.leitura.findSinistroById(id);
    if (!entidade) throw new NaoEncontradoError('Sinistro nao encontrado.');
    entidade.conferirGarantia();
    const salvo = await this.escrita.confirmarGarantia(id, entidade);
    return SinistroMapper.toSinistroResponseFromSinistroEntity(salvo);
  }
}
