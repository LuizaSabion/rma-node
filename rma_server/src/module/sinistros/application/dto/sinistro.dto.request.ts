export class SinistroRequest {
  cliente!: string;
  dispositivo!: string;
  // ETAPA 2 - Categoria e necessaria para calcular a garantia.
  tipoDispositivo!: string;
  numeroSerie!: string;
  tipoDefeito!: string;
  descricaoDefeito!: string;
  severidade?: string;
}

export class LaudoRequest {
  decisao!: string;
  laudo!: string;
}
