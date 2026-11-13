import { NivelSeveridade } from '../../domain/value-objects/severidade.value.object';
import { SinistroStatusEnum } from '../../domain/value-objects/status.value.object';
import { TipoDefeitoEnum } from '../../domain/value-objects/tipo-defeito.value.object';

export class SinistroResponse {
  id!: string;
  cliente!: string;
  dispositivo!: string;
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
  laboratorio!: number;
  reparados!: number;
  substituidos!: number;
  reprovados!: number;
}
