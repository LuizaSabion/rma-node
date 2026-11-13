"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SinistrosModule = void 0;
const common_1 = require("@nestjs/common");
const { GarantiaService } = require('./application/service/garantia.service');
const { SinistroMemoryRepository } = require('./infrastructure/adapters/sinistro.memory.repository');
const sinistros_nest_controller_1 = require("./presentation/sinistros.nest.controller");
let SinistrosModule = class SinistrosModule {
};
exports.SinistrosModule = SinistrosModule;
exports.SinistrosModule = SinistrosModule = __decorate([
    (0, common_1.Module)({
        controllers: [sinistros_nest_controller_1.SinistrosNestController],
        providers: [
            SinistroMemoryRepository,
            {
                provide: GarantiaService,
                useFactory: (repositorio) => {
                    return new GarantiaService(repositorio);
                },
                inject: [SinistroMemoryRepository],
            },
        ],
        exports: [GarantiaService],
    })
], SinistrosModule);
//# sourceMappingURL=sinistros.module.js.map