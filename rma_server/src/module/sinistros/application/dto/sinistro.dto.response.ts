import { NivelSeveridade } from '../../domain/value-objects/severidade.value.object';
import { SinistroStatusEnum } from '../../domain/value-objects/status.value.object';
import { TipoDefeitoEnum } from '../../domain/value-objects/tipo-defeito.value.object';

export class SinistroResponse {
  id!: string;
  cliente!: string;
  dispositivo!: string;
  // ETAPA 2 - Sem bytes no retorno: apenas dados necessarios para a tela.
  tipoDispositivo!: string | null;
  comprovanteAnexado!: boolean;
  comprovanteNome!: string | null;
  comprovanteConferidoEm!: Date | null;
  dataCompra!: Date | null;
  dataVencimento!: Date | null;
  prazoGarantiaMeses!: number | null;
  motivoReprovacao!: string | null;
  // ETAPA 3 - Responsavel atual para exibir e validar operacoes tecnicas.
  tecnicoResponsavelId!: string | null;
  tecnicoResponsavelNome!: string | null;
  numeroSerie!: string;
  tipoDefeito!: TipoDefeitoEnum;
  tipoDefeitoNome!: string;
  descricaoDefeito!: string;
  severidade!: NivelSeveridade;
  status!: SinistroStatusEnum;
  laudo?: string | null;
  createdAt?: Date | null;
  updateAt?: Date | null;
}

export class EstatisticasResponse {
  total!: number;
  abertos!: number;
  pendentes!: number;
  laboratorio!: number;
  // ETAPA 1 - Novo estado aparece também no resumo.
  emReparo!: number;
  reparados!: number;
  substituidos!: number;
  reprovados!: number;
}
