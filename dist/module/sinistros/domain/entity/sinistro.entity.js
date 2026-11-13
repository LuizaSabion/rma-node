"use strict";
const crypto = require("crypto");
const { STATUS, TIPOS_DEFEITO } = require("../value-objects/status");
class Sinistro {
    constructor(dados) {
        if (!dados.cliente || dados.cliente.trim() === "") {
            throw new Error("Informe o nome do cliente.");
        }
        if (!dados.numeroSerie || dados.numeroSerie.trim() === "") {
            throw new Error("Informe o número de série do aparelho.");
        }
        if (!dados.descricaoDefeito || dados.descricaoDefeito.trim().length < 10) {
            throw new Error("Descreva o defeito com pelo menos 10 caracteres.");
        }
        if (!TIPOS_DEFEITO[dados.tipoDefeito]) {
            throw new Error("Tipo de defeito inválido.");
        }
        this.id = dados.id || crypto.randomUUID();
        this.cliente = dados.cliente.trim();
        this.dispositivo = dados.dispositivo ? dados.dispositivo.trim() : "";
        this.numeroSerie = dados.numeroSerie.trim().toUpperCase();
        this.tipoDefeito = dados.tipoDefeito;
        this.descricaoDefeito = dados.descricaoDefeito.trim();
        this.severidade = dados.severidade || TIPOS_DEFEITO[dados.tipoDefeito].severidade;
        this.status = dados.status || STATUS.ABERTO;
        this.laudo = dados.laudo || null;
        this.createdAt = dados.createdAt || new Date().toISOString();
        this.updatedAt = dados.updatedAt || null;
    }
}
module.exports = { Sinistro };
//# sourceMappingURL=sinistro.entity.js.map