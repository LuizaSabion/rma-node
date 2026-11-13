import { SinistroResponse } from '../../dto/sinistro.dto.response';

export const ENVIAR_LABORATORIO_USE_CASE = 'ENVIAR_LABORATORIO_USE_CASE';

export interface EnviarLaboratorioUseCase {
  execute(id: string): Promise<SinistroResponse>;
}
