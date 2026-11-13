export class SinistrosController {
    constructor(service: any);
    service: any;
    listar(req: any, res: any, query: any): void;
    estatisticas(req: any, res: any): void;
    abrir(req: any, res: any, body: any): void;
    enviarParaLaboratorio(req: any, res: any, id: any): void;
    emitirLaudo(req: any, res: any, id: any, body: any): void;
}
