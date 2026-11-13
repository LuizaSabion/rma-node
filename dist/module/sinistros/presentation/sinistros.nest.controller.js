"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SinistrosNestController = void 0;
const common_1 = require("@nestjs/common");
const { GarantiaService } = require('../application/service/garantia.service');
let SinistrosNestController = class SinistrosNestController {
    constructor(garantiaService) {
        this.garantiaService = garantiaService;
    }
    listar(status) {
        return this.garantiaService.listarFila(status || 'TODOS');
    }
    estatisticas() {
        return this.garantiaService.estatisticas();
    }
    abrir(body) {
        return this.garantiaService.abrirSinistro(body);
    }
    enviarParaLaboratorio(id) {
        return this.garantiaService.enviarParaLaboratorio(id);
    }
    emitirLaudo(id, body) {
        return this.garantiaService.emitirLaudo(id, body.decisao, body.laudo);
    }
};
exports.SinistrosNestController = SinistrosNestController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SinistrosNestController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('estatisticas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SinistrosNestController.prototype, "estatisticas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SinistrosNestController.prototype, "abrir", null);
__decorate([
    (0, common_1.Post)(':id/enviar-laboratorio'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SinistrosNestController.prototype, "enviarParaLaboratorio", null);
__decorate([
    (0, common_1.Post)(':id/laudo'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SinistrosNestController.prototype, "emitirLaudo", null);
exports.SinistrosNestController = SinistrosNestController = __decorate([
    (0, common_1.Controller)('api/sinistros'),
    __param(0, (0, common_1.Inject)(GarantiaService)),
    __metadata("design:paramtypes", [Object])
], SinistrosNestController);
//# sourceMappingURL=sinistros.nest.controller.js.map