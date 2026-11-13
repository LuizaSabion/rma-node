export declare class SinistrosNestController {
    private readonly garantiaService;
    constructor(garantiaService: any);
    listar(status?: string): any;
    estatisticas(): any;
    abrir(body: any): any;
    enviarParaLaboratorio(id: string): any;
    emitirLaudo(id: string, body: any): any;
}
