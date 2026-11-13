"use strict";
const { SinistroRepositoryPort } = require("../../domain/ports/sinistro.repository");
const { Sinistro } = require("../../domain/entity/sinistro.entity");
class SinistroMemoryRepository extends SinistroRepositoryPort {
    constructor() {
        super();
        this.dados = [];
    }
    listar() {
        return this.dados.map((s) => new Sinistro(s));
    }
    salvar(sinistro) {
        const indice = this.dados.findIndex((s) => s.id === sinistro.id);
        if (indice === -1) {
            this.dados.push(sinistro);
        }
        else {
            this.dados[indice] = sinistro;
        }
        return sinistro;
    }
}
module.exports = { SinistroMemoryRepository };
//# sourceMappingURL=sinistro.memory.repository.js.map