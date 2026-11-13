import { NivelSeveridade } from '../../domain/value-objects/severidade.value-object';
import { StatusSinistroEnum } from '../../domain/value-objects/status.value-object';

export class SinistroResponse {
  id?: string;
  cliente!: string;
  dispositivo?: string;
  numeroSerie!: string;
  tipoDefeito!: string;
  descricaoDefeito!: string;
  laudo?: string;
  severidade!: NivelSeveridade;
  status!: StatusSinistroEnum;
  createdAt?: Date | null;
  updateAt?: Date | null;

  constructor(props: Partial<SinistroResponse>) {
    Object.assign(this, props);
  }
}
