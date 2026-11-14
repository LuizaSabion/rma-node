import 'dotenv/config';
import { PrismaService } from '../src/database/prisma.service';
import { hashSenha } from '../src/module/auth/seguranca';
import { PerfilUsuario } from '@prisma/client';

// ETAPA 3 - Crie o primeiro administrador UMA VEZ via terminal, sem senha embutida no codigo.
async function main() {
  const nome = (process.env.ADMIN_NOME || 'Administrador').trim();
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const senha = process.env.ADMIN_SENHA || '';
  if (!email.includes('@') || senha.length < 10 || senha.length > 128) {
    throw new Error('Defina ADMIN_EMAIL válido e ADMIN_SENHA com 10 a 128 caracteres.');
  }
  const prisma = new PrismaService();
  try {
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) throw new Error('Este e-mail ja existe. Nao sobrescrevemos usuarios.');
    await prisma.usuario.create({ data: { nome, email, senhaHash: hashSenha(senha), perfil: PerfilUsuario.ADMINISTRADOR } });
    console.log('Administrador criado:', email);
  } finally { await prisma.$disconnect(); }
}
main().catch((erro) => { console.error(erro.message); process.exitCode = 1; });
