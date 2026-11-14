-- ETAPA 3 - Somente estruturas novas, sem recriar sinistros e sem apagar dados.
CREATE TYPE "PerfilUsuario" AS ENUM ('ATENDENTE', 'TECNICO', 'ADMINISTRADOR');
CREATE TABLE "usuarios" (
  "id" TEXT NOT NULL, "nome" TEXT NOT NULL, "email" TEXT NOT NULL,
  "senha_hash" TEXT NOT NULL, "perfil" "PerfilUsuario" NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE TABLE "sessoes" (
  "id" TEXT NOT NULL, "usuario_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL, "expira_em" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "sessoes_token_hash_key" ON "sessoes"("token_hash");
CREATE INDEX "sessoes_usuario_id_idx" ON "sessoes"("usuario_id");
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_usuario_id_fkey"
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sinistros" ADD COLUMN "tecnico_responsavel_id" TEXT;
CREATE INDEX "sinistros_tecnico_responsavel_id_idx" ON "sinistros"("tecnico_responsavel_id");
ALTER TABLE "sinistros" ADD CONSTRAINT "sinistros_tecnico_responsavel_id_fkey"
  FOREIGN KEY ("tecnico_responsavel_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE TABLE "movimentacoes_tecnico" (
  "id" TEXT NOT NULL, "sinistro_id" TEXT NOT NULL,
  "responsavel_anterior_id" TEXT, "responsavel_novo_id" TEXT NOT NULL,
  "autor_id" TEXT NOT NULL, "justificativa" TEXT NOT NULL,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "movimentacoes_tecnico_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "movimentacoes_tecnico_sinistro_id_idx" ON "movimentacoes_tecnico"("sinistro_id");
ALTER TABLE "movimentacoes_tecnico" ADD CONSTRAINT "movimentacoes_tecnico_sinistro_id_fkey"
 FOREIGN KEY ("sinistro_id") REFERENCES "sinistros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ETAPA 3 - Garantia referencial das pessoas envolvidas nas atribuicoes.
ALTER TABLE "movimentacoes_tecnico" ADD CONSTRAINT "movimentacoes_tecnico_responsavel_anterior_id_fkey"
 FOREIGN KEY ("responsavel_anterior_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "movimentacoes_tecnico" ADD CONSTRAINT "movimentacoes_tecnico_responsavel_novo_id_fkey"
 FOREIGN KEY ("responsavel_novo_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "movimentacoes_tecnico" ADD CONSTRAINT "movimentacoes_tecnico_autor_id_fkey"
 FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
