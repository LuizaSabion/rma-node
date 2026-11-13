class SinistrosController {
    constructor(service) {
        this.service = service;
    }

    listar(req, res, query) {
        const filtro = query.status || "TODOS";
        const lista = this.service.listarFila(filtro);
        enviarJson(res, 200, lista);
    }

    estatisticas(req, res) {
        const stats = this.service.estatisticas();
        enviarJson(res, 200, stats);
    }

    abrir(req, res, body) {
        try {
            const novo = this.service.abrirSinistro(body);
            enviarJson(res, 201, novo);
        } catch (erro) {
            enviarJson(res, 400, { mensagem: erro.message });
        }
    }

    enviarParaLaboratorio(req, res, id) {
        try {
            const sinistro = this.service.enviarParaLaboratorio(id);
            enviarJson(res, 200, sinistro);
        } catch (erro) {
            enviarJson(res, 400, { mensagem: erro.message });
        }
    }

    emitirLaudo(req, res, id, body) {
        try {
            const sinistro = this.service.emitirLaudo(id, body.decisao, body.laudo);
            enviarJson(res, 200, sinistro);
        } catch (erro) {
            enviarJson(res, 400, { mensagem: erro.message });
        }
    }
}

function enviarJson(res, status, dados) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(dados));
}

module.exports = { SinistrosController };
