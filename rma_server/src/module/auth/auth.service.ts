import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { hashSenha, hashToken, novoToken, verificarSenha } from './seguranca';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // ETAPA 3 - Sessao aleatoria, persistida apenas como hash e com expiracao em 8h.
  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: (email || '').trim().toLowerCase() } });
    // Comparacao com hash ficticio evita atalhos grosseiros na verificacao.
    if (!usuario || !usuario.ativo || !verificarSenha(senha ?? '', usuario.senhaHash)) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    const token = novoToken();
    const expiraEm = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await this.prisma.sessao.create({ data: { usuarioId: usuario.id, tokenHash: hashToken(token), expiraEm } });
    return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } };
  }

  async sair(token: string) {
    await this.prisma.sessao.deleteMany({ where: { tokenHash: hashToken(token) } });
    return { ok: true };
  }

  async tecnicos() {
    return this.prisma.usuario.findMany({ where: { perfil: PerfilUsuario.TECNICO, ativo: true },
      select: { id: true, nome: true }, orderBy: { nome: 'asc' } });
  }

  async listarUsuarios() {
    return this.prisma.usuario.findMany({ select: { id: true, nome: true, email: true, perfil: true, ativo: true }, orderBy: { nome: 'asc' } });
  }

  async criarUsuario(dados: { nome: string; email: string; senha: string; perfil: PerfilUsuario }) {
    const nome = (dados.nome || '').trim(), email = (dados.email || '').trim().toLowerCase();
    if (nome.length < 3 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new BadRequestException('Informe nome e e-mail válidos.');
    if (!dados.senha || dados.senha.length < 10 || dados.senha.length > 128) throw new BadRequestException('A senha deve ter entre 10 e 128 caracteres.');
    if (!Object.values(PerfilUsuario).includes(dados.perfil)) throw new BadRequestException('Perfil inválido.');
    const existe = await this.prisma.usuario.findUnique({ where: { email } });
    if (existe) throw new ConflictException('Já existe um usuário com este e-mail.');
    return this.prisma.usuario.create({ data: { nome, email, senhaHash: hashSenha(dados.senha), perfil: dados.perfil },
      select: { id: true, nome: true, email: true, perfil: true, ativo: true } });
  }

  async atualizarUsuario(id: string, dados: { perfil?: PerfilUsuario; ativo?: boolean }, autorId: string) {
    if (id === autorId) throw new ForbiddenException('Por segurança, altere outro usuário administrador, não sua própria conta.');
    if (dados.perfil !== undefined && !Object.values(PerfilUsuario).includes(dados.perfil)) throw new BadRequestException('Perfil inválido.');
    if (dados.ativo !== undefined && typeof dados.ativo !== 'boolean') throw new BadRequestException('O campo ativo deve ser booleano.');
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new BadRequestException('Usuário não encontrado.');
    // ETAPA 3 - Sem transferir a responsabilidade, nao desativamos tecnicos com aparelhos em aberto.
    if ((dados.ativo === false || (dados.perfil && dados.perfil !== PerfilUsuario.TECNICO)) && usuario.perfil === PerfilUsuario.TECNICO) {
      const pendentes = await this.prisma.sinistro.count({ where: { tecnicoResponsavelId: id, status: { in: ['EM_LABORATORIO', 'EM_REPARO'] } } });
      if (pendentes) throw new ConflictException('Transfira primeiro os sinistros em andamento deste técnico.');
    }
    const resultado = await this.prisma.usuario.update({ where: { id }, data: {
      ...(dados.perfil !== undefined ? { perfil: dados.perfil } : {}),
      ...(dados.ativo !== undefined ? { ativo: dados.ativo } : {}),
    }, select: { id: true, nome: true, email: true, perfil: true, ativo: true } });
    // Revogar sessoes ao alterar permissoes ou desativar usuario.
    await this.prisma.sessao.deleteMany({ where: { usuarioId: id } });
    return resultado;
  }
}
