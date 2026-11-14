import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { AuthService } from './auth.service';
import { Perfis, Publico, UsuarioAtual, UsuarioAutenticado } from './auth.roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Publico()
  @Post('login')
  login(@Body() entrada: { email: string; senha: string }) { return this.service.login(entrada?.email, entrada?.senha); }

  @Post('logout')
  sair(@Headers('authorization') bearer: string) { return this.service.sair((bearer || '').replace(/^Bearer /, '')); }

  @Get('me')
  me(@UsuarioAtual() usuario: UsuarioAutenticado) { return usuario; }

  @Get('tecnicos')
  tecnicos() { return this.service.tecnicos(); }

  @Perfis(PerfilUsuario.ADMINISTRADOR)
  @Get('usuarios')
  listar() { return this.service.listarUsuarios(); }

  @Perfis(PerfilUsuario.ADMINISTRADOR)
  @Post('usuarios')
  cadastrar(@Body() dados: { nome: string; email: string; senha: string; perfil: PerfilUsuario }) {
    return this.service.criarUsuario(dados);
  }

  @Perfis(PerfilUsuario.ADMINISTRADOR)
  @Patch('usuarios/:id')
  atualizar(@Param('id') id: string, @Body() dados: { perfil?: PerfilUsuario; ativo?: boolean }, @UsuarioAtual() autor: UsuarioAutenticado) {
    return this.service.atualizarUsuario(id, dados, autor.id);
  }
}
