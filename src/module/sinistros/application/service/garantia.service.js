const { Sinistro } = require("../../domain/entity/sinistro.entity");
const { STATUS, LIMITE_REPAROS } = require("../../domain/value-objects/status");

class GarantiaService {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    abrirSinistro(dados) {
        const novo = new Sinistro(dados);
        return this.repositorio.salvar(novo);
    }

    listarFila(filtro) {
        if (filtro === undefined) filtro = "TODOS";

        const pesoSeveridade = { ALTA: 0, MEDIA: 1, BAIXA: 2 };

        let lista = this.repositorio.listar();

        if (filtro !== "TODOS") {
            lista = lista.filter((s) => s.status === filtro);
        }

        lista.sort(function (a, b) {
            if (pesoSeveridade[a.severidade] !== pesoSeveridade[b.severidade]) {
                return pesoSeveridade[a.severidade] - pesoSeveridade[b.severidade];
            }
            return a.createdAt.localeCompare(b.createdAt);
        });

        return lista;
    }

    buscarPorId(id) {
        const encontrado = this.repositorio.listar().find((s) => s.id === id);
        if (!encontrado) {
            throw new Error("Sinistro não encontrado.");
        }
        return encontrado;
    }

    enviarParaLaboratorio(id) {
        const sinistro = this.buscarPorId(id);

        if (sinistro.status !== STATUS.ABERTO) {
            throw new Error("Só é possível enviar ao laboratório sinistros que estão abertos.");
        }

        sinistro.status = STATUS.EM_LABORATORIO;
        sinistro.updatedAt = new Date().toISOString();
        this.repositorio.salvar(sinistro);
        return sinistro;
    }

    emitirLaudo(id, decisao, laudo) {
        const sinistro = this.buscarPorId(id);

        if (sinistro.status !== STATUS.EM_LABORATORIO) {
            throw new Error("O sinistro precisa estar no laboratório antes de receber um laudo.");
        }
        if (!laudo || laudo.trim().length < 10) {
            throw new Error("Escreva o laudo com pelo menos 10 caracteres.");
        }

        let statusFinal = decisao;

        // se esse aparelho já foi reparado LIMITE_REPAROS vezes, não faz
        // sentido reparar de novo, vira substituição automática
        if (decisao === STATUS.REPARADO) {
            const qtdReparos = this.totalReparos(sinistro.numeroSerie);
            if (qtdReparos >= LIMITE_REPAROS) {
                statusFinal = STATUS.SUBSTITUIDO;
                laudo = laudo + " (substituição automática: aparelho já passou por " + qtdReparos + " reparos)";
            }
        }

        sinistro.laudo = laudo.trim();
        sinistro.status = statusFinal;
        sinistro.updatedAt = new Date().toISOString();

        this.repositorio.salvar(sinistro);
        return sinistro;
    }

    totalReparos(numeroSerie) {
        const todos = this.repositorio.listar();
        let contador = 0;
        for (const s of todos) {
            if (s.numeroSerie === numeroSerie && s.status === STATUS.REPARADO) {
                contador++;
            }
        }
        return contador;
    }

    estatisticas() {
        const todos = this.repositorio.listar();
        const contar = (status) => todos.filter((s) => s.status === status).length;

        return {
            total: todos.length,
            abertos: contar(STATUS.ABERTO),
            laboratorio: contar(STATUS.EM_LABORATORIO),
            reparados: contar(STATUS.REPARADO),
            substituidos: contar(STATUS.SUBSTITUIDO),
            reprovados: contar(STATUS.REPROVADO)
        };
    }
}

module.exports = { GarantiaService };
