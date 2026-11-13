export class SinistroMemoryRepository extends SinistroRepositoryPort {
    dados: any[];
    listar(): Sinistro[];
    salvar(sinistro: any): any;
}
import { SinistroRepositoryPort } from "../../domain/ports/sinistro.repository";
import { Sinistro } from "../../domain/entity/sinistro.entity";
