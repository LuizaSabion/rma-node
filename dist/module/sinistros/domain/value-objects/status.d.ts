export namespace STATUS {
    let ABERTO: string;
    let EM_LABORATORIO: string;
    let REPARADO: string;
    let SUBSTITUIDO: string;
    let REPROVADO: string;
}
export namespace SEVERIDADE {
    let BAIXA: string;
    let MEDIA: string;
    let ALTA: string;
}
export namespace TIPOS_DEFEITO {
    namespace TELA {
        export let nome: string;
        import severidade = SEVERIDADE.MEDIA;
        export { severidade };
    }
    namespace BATERIA {
        let nome_1: string;
        export { nome_1 as nome };
        import severidade_1 = SEVERIDADE.ALTA;
        export { severidade_1 as severidade };
    }
    namespace PLACA {
        let nome_2: string;
        export { nome_2 as nome };
        import severidade_2 = SEVERIDADE.ALTA;
        export { severidade_2 as severidade };
    }
    namespace CONECTOR {
        let nome_3: string;
        export { nome_3 as nome };
        import severidade_3 = SEVERIDADE.MEDIA;
        export { severidade_3 as severidade };
    }
    namespace SOFTWARE {
        let nome_4: string;
        export { nome_4 as nome };
        import severidade_4 = SEVERIDADE.BAIXA;
        export { severidade_4 as severidade };
    }
}
export const LIMITE_REPAROS: 2;
