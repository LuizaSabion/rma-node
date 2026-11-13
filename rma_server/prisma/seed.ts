import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';

const url = process.env.DATABASE_URL as string;
const schema = new URL(url).searchParams.get('schema') ?? 'public';
const prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: url }), { schema }) });

// dados da primeira entrega
async function main() {
  await prisma.sinistro.deleteMany();

  const agora = Date.now();
  const minutosAtras = (n: number) => new Date(agora - n * 60 * 1000);

  await prisma.sinistro.createMany({
    data: [
      {
        id: randomUUID(),
        cliente: 'Mariana Costa',
        dispositivo: 'Smartphone Zenith X200',
        numeroSerie: 'SNX20001',
        tipoDefeito: 'BATERIA',
        severidade: 'ALTA',
        descricaoDefeito: 'Bateria inchando e não carrega mais.',
        createdAt: minutosAtras(50),
      },
      {
        id: randomUUID(),
        cliente: 'Rafael Souza',
        dispositivo: 'Notebook Zenith Book 14',
        numeroSerie: 'SNB14002',
        tipoDefeito: 'TELA',
        severidade: 'MEDIA',
        descricaoDefeito: 'Tela com listras coloridas na parte de baixo.',
        createdAt: minutosAtras(40),
      },
      {
        id: randomUUID(),
        cliente: 'Camila Alves',
        dispositivo: 'Smartphone Zenith X200',
        numeroSerie: 'SNX20003',
        tipoDefeito: 'SOFTWARE',
        severidade: 'BAIXA',
        descricaoDefeito: 'Aparelho reinicia sozinho toda hora.',
        createdAt: minutosAtras(30),
      },
      {
        id: randomUUID(),
        cliente: 'Bruno Lima',
        dispositivo: 'Fone Zenith Air Pro',
        numeroSerie: 'SNF10004',
        tipoDefeito: 'CONECTOR',
        severidade: 'MEDIA',
        descricaoDefeito: 'Um dos lados do fone não carrega na case.',
        status: 'EM_LABORATORIO',
        createdAt: minutosAtras(20),
      },
      {
        id: randomUUID(),
        cliente: 'Larissa Nunes',
        dispositivo: 'Notebook Zenith Book 14',
        numeroSerie: 'SNB14005',
        tipoDefeito: 'PLACA',
        severidade: 'ALTA',
        descricaoDefeito: 'Notebook não liga mais depois de uma queda de energia.',
        status: 'REPARADO',
        laudo: 'Placa trocada em bancada, aparelho testado e funcionando.',
        createdAt: minutosAtras(10),
      },
    ],
  });

  console.log('Seed concluído: 5 sinistros cadastrados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
