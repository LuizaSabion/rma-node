export class SinistroRequest {
  id!: string;
  cliente!: string;
  dispositivo?: string;
  numeroSerie!: string;
  tipoDefeito!: 'TELA' | 'BATERIA' | 'PLACA' | 'CONECTOR' | 'SOFTWARE';
  descricaoDefeito!: string;
  laudo?: string;
  status?: string;

  constructor(props: Partial<SinistroRequest>) {
    Object.assign(this, props);
  }
}
