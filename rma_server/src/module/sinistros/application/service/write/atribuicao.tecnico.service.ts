import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { PrismaService } from '../../../../../database/prisma.service';
import { UsuarioAutenticado } from '../../../../auth/auth.roles';
import { SinistroMapper, comprovanteResumoSelect } from '../../../infrastructure/mappers/sinistro.mappers';

@Injectable()
export class AtribuicaoTecnicoService {
  constructor(private readonly prisma: PrismaService) {}

  // ETAPA 3 - Atendente/admin atribui tecnico livre; tecnico so pode assumir a si proprio.
  async atribuir(id: string, tecnicoId: string, autor: UsuarioAutenticado) {
    if (autor.perfil === PerfilUsuario.TECNICO && tecnicoId !== autor.id) {
      throw new ForbiddenException('O técnico só pode assumir sinistros para si.');
    }
    const tecnico = await this.prisma.usuario.findUnique({ where: { id: tecnicoId } });
    if (!tecnico || tecnico.perfil !== PerfilUsuario.TECNICO || !tecnico.ativo) {
      throw new BadRequestException('Selecione um técnico ativo.');
    }
    await this.prisma.$transaction(async (tx) => {
      // ETAPA 3 - A condicao tecnicoResponsavelId:null evita dupla atribuicao simultanea.
      const res = await tx.sinistro.updateMany({ where: { id, tecnicoResponsavelId: null,
        status: { in: ['EM_LABORATORIO'] } }, data: { tecnicoResponsavelId: tecnicoId } });
      if (!res.count) throw new ConflictException('Sinistro indisponível, fora do laboratório ou já atribuído. Atualize a página.');
      await tx.movimentacaoTecnico.create({ data: { sinistroId: id, responsavelAnteriorId: null,
        responsavelNovoId: tecnicoId, autorId: autor.id, justificativa: 'Atribuição inicial' } });
    });
    return this.obterSinistro(id);
  }

  // ETAPA 3 - Apenas admin transfere; justificativa e registro sao obrigatorios.
  async transferir(id: string, tecnicoId: string, justificativa: string, autor: UsuarioAutenticado) {
    if (autor.perfil !== PerfilUsuario.ADMINISTRADOR) throw new ForbiddenException('Somente o administrador pode transferir.');
    if (!justificativa?.trim() || justificativa.trim().length < 10) throw new BadRequestException('Informe uma justificativa de 10 caracteres ou mais.');
    const tecnico = await this.prisma.usuario.findUnique({ where: { id: tecnicoId } });
    if (!tecnico || tecnico.perfil !== PerfilUsuario.TECNICO || !tecnico.ativo) throw new BadRequestException('Técnico de destino inválido ou inativo.');
    await this.prisma.$transaction(async (tx) => {
      const atual = await tx.sinistro.findUnique({ where: { id }, select: { tecnicoResponsavelId: true, status: true } });
      if (!atual) throw new NotFoundException('Sinistro não encontrado.');
      if (!atual.tecnicoResponsavelId) throw new BadRequestException('Sinistro sem técnico: faça a atribuição inicial.');
      if (!['EM_LABORATORIO','EM_REPARO'].includes(atual.status)) throw new BadRequestException('Transferência permitida somente durante atendimento técnico.');
      if (atual.tecnicoResponsavelId === tecnicoId) throw new BadRequestException('O técnico selecionado já é o responsável.');
      const alterado = await tx.sinistro.updateMany({ where: { id, tecnicoResponsavelId: atual.tecnicoResponsavelId }, data: { tecnicoResponsavelId: tecnicoId } });
      if (!alterado.count) throw new ConflictException('O responsável mudou. Atualize a página.');
      await tx.movimentacaoTecnico.create({ data: { sinistroId: id,
        responsavelAnteriorId: atual.tecnicoResponsavelId,
        responsavelNovoId: tecnicoId, autorId: autor.id,
        justificativa: justificativa.trim() } });
    });
    return this.obterSinistro(id);
  }

  private async obterSinistro(id: string) {
    const salvo = await this.prisma.sinistro.findUniqueOrThrow({ where: { id },
      include: { comprovante: { select: comprovanteResumoSelect }, tecnicoResponsavel: { select: { nome: true } } } });
    return SinistroMapper.toSinistroResponseFromSinistroEntity(SinistroMapper.toSinistroEntityFromSinistroPrisma(salvo));
  }
}
