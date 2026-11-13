export class GarantiaService {
    constructor(repositorio: any);
    repositorio: any;
    abrirSinistro(dados: any): any;
    listarFila(filtro: any): any;
    buscarPorId(id: any): any;
    enviarParaLaboratorio(id: any): any;
    emitirLaudo(id: any, decisao: any, laudo: any): any;
    totalReparos(numeroSerie: any): number;
    estatisticas(): {
        total: any;
        abertos: any;
        laboratorio: any;
        reparados: any;
        substituidos: any;
        reprovados: any;
    };
}
