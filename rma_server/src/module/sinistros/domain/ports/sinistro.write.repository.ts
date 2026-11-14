import { SinistroEntity } from '../entity/sinistro.entity';

// ETAPA 2 - Tipagem pequena, sem necessidade de criar outro modulo.
export type ArquivoComprovante = { nomeArquivo: string; tipoMime: string; conteudo: Uint8Array; }; 

export const SINISTRO_WRITE_REPOSITORY = 'SINISTRO_WRITE_REPOSITORY';

export interface SinistroWriteRepository {
  createSinistro(sinistroEntity: SinistroEntity): Promise<SinistroEntity>;
  updateSinistro(id: string, sinistroEntity: SinistroEntity): Promise<SinistroEntity>;
  deleteSinistro(id: string): Promise<void>;
  anexarComprovante(id: string, sinistro: SinistroEntity, arquivo: ArquivoComprovante): Promise<SinistroEntity>;
  confirmarGarantia(id: string, sinistro: SinistroEntity): Promise<SinistroEntity>;
}
