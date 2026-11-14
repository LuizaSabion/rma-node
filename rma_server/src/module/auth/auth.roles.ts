import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';

// ETAPA 3 - RBAC no backend: a role vem da sessao validada, nunca do JSON da tela.
export type UsuarioAutenticado = { id: string; nome: string; email: string; perfil: PerfilUsuario };
export const Publico = () => SetMetadata('publico', true);
export const Perfis = (...perfis: PerfilUsuario[]) => SetMetadata('perfis', perfis);
export const UsuarioAtual = createParamDecorator((_data: unknown, ctx: ExecutionContext): UsuarioAutenticado => {
  return ctx.switchToHttp().getRequest<{ usuario: UsuarioAutenticado }>().usuario;
});
