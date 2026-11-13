export const DELETE_SINISTRO_USE_CASE = 'DELETE_SINISTRO_USE_CASE';

export interface DeleteSinistroUseCase {
  execute(id: string): Promise<void>;
}
