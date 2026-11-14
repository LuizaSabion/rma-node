// ETAPA 3 - O perfil e a identidade vêm da sessão validada pelo backend.
export type Perfil = 'ATENDENTE' | 'TECNICO' | 'ADMINISTRADOR';
export type Usuario = { id: string; nome: string; email: string; perfil: Perfil };
export type Tecnico = { id: string; nome: string };
export type UsuarioCadastro = Usuario & { ativo: boolean };
