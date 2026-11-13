const http = require("http");
const path = require("path");
const url = require("url");

const { SinistroMemoryRepository } = require("./module/sinistros/infrastructure/adapters/sinistro.memory.repository");
const { GarantiaService } = require("./module/sinistros/application/service/garantia.service");
const { SinistrosController } = require("./module/sinistros/presentation/sinistros.controller");
const { servirArquivoEstatico } = require("./shared/servir-arquivo-estatico");

const PORTA = 3001;
const PASTA_PUBLIC = path.join(__dirname, "..", "public");

const repositorio = new SinistroMemoryRepository();
const service = new GarantiaService(repositorio);
const controller = new SinistrosController(service);

criarDadosIniciais();

const servidor = http.createServer(function (req, res) {
    const rota = url.parse(req.url, true);
    const partes = rota.pathname.split("/").filter(Boolean); // ex: ["api","sinistros","123","laudo"]

    if (partes[0] === "api" && partes[1] === "sinistros") {

        if (req.method === "GET" && partes.length === 2) {
            return controller.listar(req, res, rota.query);
        }

        if (req.method === "POST" && partes.length === 2) {
            return lerCorpo(req, function (body) {
                controller.abrir(req, res, body);
            });
        }

        if (req.method === "GET" && partes[2] === "estatisticas") {
            return controller.estatisticas(req, res);
        }

        if (req.method === "POST" && partes.length === 4 && partes[3] === "enviar-laboratorio") {
            return controller.enviarParaLaboratorio(req, res, partes[2]);
        }

        if (req.method === "POST" && partes.length === 4 && partes[3] === "laudo") {
            return lerCorpo(req, function (body) {
                controller.emitirLaudo(req, res, partes[2], body);
            });
        }
    }

    servirArquivoEstatico(req, res, PASTA_PUBLIC);
});

servidor.listen(PORTA, function () {
    console.log("Servidor rodando em http://localhost:" + PORTA);
});

function lerCorpo(req, callback) {
    let dados = "";
    req.on("data", function (pedaco) {
        dados += pedaco;
    });
    req.on("end", function () {
        try {
            callback(dados ? JSON.parse(dados) : {});
        } catch (erro) {
            callback({});
        }
    });
}

function criarDadosIniciais() {
    const exemplos = [
        ["Mariana Costa", "Smartphone Zenith X200", "SNX20001", "BATERIA", "Bateria inchando e não carrega mais."],
        ["Rafael Souza", "Notebook Zenith Book 14", "SNB14002", "TELA", "Tela com listras coloridas na parte de baixo."],
        ["Camila Alves", "Smartphone Zenith X200", "SNX20003", "SOFTWARE", "Aparelho reinicia sozinho toda hora."],
        ["Bruno Lima", "Fone Zenith Air Pro", "SNF10004", "CONECTOR", "Um dos lados do fone não carrega na case."],
        ["Larissa Nunes", "Notebook Zenith Book 14", "SNB14005", "PLACA", "Notebook não liga mais depois de uma queda de energia."]
    ];

    for (const exemplo of exemplos) {
        service.abrirSinistro({
            cliente: exemplo[0],
            dispositivo: exemplo[1],
            numeroSerie: exemplo[2],
            tipoDefeito: exemplo[3],
            descricaoDefeito: exemplo[4]
        });
    }

    const abertos = service.listarFila("ABERTO");
    const ultimos = abertos.slice(-2);

    service.enviarParaLaboratorio(ultimos[0].id);

    service.enviarParaLaboratorio(ultimos[1].id);
    service.emitirLaudo(ultimos[1].id, "REPARADO", "Placa trocada em bancada, aparelho testado e funcionando.");
}
