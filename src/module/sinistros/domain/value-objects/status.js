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

// cada tipo de defeito já entra com uma severidade padrão
const TIPOS_DEFEITO = {
    TELA: { nome: "Tela / display", severidade: SEVERIDADE.MEDIA },
    BATERIA: { nome: "Bateria", severidade: SEVERIDADE.ALTA },
    PLACA: { nome: "Placa-mãe", severidade: SEVERIDADE.ALTA },
    CONECTOR: { nome: "Conector / porta de carga", severidade: SEVERIDADE.MEDIA },
    SOFTWARE: { nome: "Software / firmware", severidade: SEVERIDADE.BAIXA }
};

// se o mesmo aparelho já foi reparado esse tanto de vezes,
// a próxima decisão de reparo se torna substituição automática
const LIMITE_REPAROS = 2;

module.exports = { STATUS, SEVERIDADE, TIPOS_DEFEITO, LIMITE_REPAROS };
