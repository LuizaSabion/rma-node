import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { hashToken } from './seguranca';
import { UsuarioAutenticado } from './auth.roles';

@Injectable()
export class SessaoGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly reflector: Reflector) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>('publico', [contexto.getHandler(), contexto.getClass()])) return true;
    const req = contexto.switchToHttp().getRequest<{ headers: { authorization?: string }; usuario?: UsuarioAutenticado }>();
    const match = /^Bearer ([a-f0-9]{64})$/.exec(req.headers.authorization || '');
    if (!match) throw new UnauthorizedException('Faça login para acessar o sistema.');
    const sessao = await this.prisma.sessao.findUnique({
      where: { tokenHash: hashToken(match[1]) }, include: { usuario: true },
    });
    if (!sessao || sessao.expiraEm <= new Date() || !sessao.usuario.ativo) {
      throw new UnauthorizedException('Sessão inválida ou expirada. Entre novamente.');
    }
    req.usuario = { id: sessao.usuario.id, nome: sessao.usuario.nome,
      email: sessao.usuario.email, perfil: sessao.usuario.perfil };
    const perfis = this.reflector.getAllAndOverride<PerfilUsuario[]>('perfis', [contexto.getHandler(), contexto.getClass()]);
    if (perfis?.length && !perfis.includes(req.usuario.perfil)) throw new ForbiddenException('Seu perfil não permite esta ação.');
    return true;
  }
}
