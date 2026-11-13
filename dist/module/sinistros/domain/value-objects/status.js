"use strict";
const STATUS = {
    ABERTO: "ABERTO",
    EM_LABORATORIO: "EM_LABORATORIO",
    REPARADO: "REPARADO",
    SUBSTITUIDO: "SUBSTITUIDO",
    REPROVADO: "REPROVADO"
};
const SEVERIDADE = {
    BAIXA: "BAIXA",
    MEDIA: "MEDIA",
    ALTA: "ALTA"
};
const TIPOS_DEFEITO = {
    TELA: { nome: "Tela / display", severidade: SEVERIDADE.MEDIA },
    BATERIA: { nome: "Bateria", severidade: SEVERIDADE.ALTA },
    PLACA: { nome: "Placa-mãe", severidade: SEVERIDADE.ALTA },
    CONECTOR: { nome: "Conector / porta de carga", severidade: SEVERIDADE.MEDIA },
    SOFTWARE: { nome: "Software / firmware", severidade: SEVERIDADE.BAIXA }
};
const LIMITE_REPAROS = 2;
module.exports = { STATUS, SEVERIDADE, TIPOS_DEFEITO, LIMITE_REPAROS };
//# sourceMappingURL=status.js.map