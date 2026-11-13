export class SinistroRequest {
  cliente!: string;
  dispositivo!: string;
  numeroSerie!: string;
  tipoDefeito!: string;
  descricaoDefeito!: string;
  severidade?: string;
}

export class LaudoRequest {
  decisao!: string;
  laudo!: string;
}
