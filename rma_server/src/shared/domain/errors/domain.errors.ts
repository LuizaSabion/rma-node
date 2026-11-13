export class RegraNegocioError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'RegraNegocioError';
  }
}

export class NaoEncontradoError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'NaoEncontradoError';
  }
}
