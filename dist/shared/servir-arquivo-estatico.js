"use strict";
const fs = require("fs");
const path = require("path");
const TIPOS = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};
function servirArquivoEstatico(req, res, pastaPublic) {
    let caminho = req.url === "/" ? "/index.html" : req.url;
    caminho = path.join(pastaPublic, caminho);
    fs.readFile(caminho, function (erro, conteudo) {
        if (erro) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Arquivo não encontrado.");
            return;
        }
        const extensao = path.extname(caminho);
        const tipo = TIPOS[extensao] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": tipo });
        res.end(conteudo);
    });
}
module.exports = { servirArquivoEstatico };
//# sourceMappingURL=servir-arquivo-estatico.js.map