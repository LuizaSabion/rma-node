-- CreateEnum
CREATE TYPE "StatusSinistro" AS ENUM ('ABERTO', 'EM_LABORATORIO', 'REPARADO', 'SUBSTITUIDO', 'REPROVADO');

-- CreateEnum
CREATE TYPE "TipoDefeito" AS ENUM ('TELA', 'BATERIA', 'PLACA', 'CONECTOR', 'SOFTWARE');

-- CreateEnum
CREATE TYPE "Severidade" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- CreateTable
CREATE TABLE "sinistros" (
    "id" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "dispositivo" TEXT NOT NULL,
    "numero_serie" TEXT NOT NULL,
    "tipo_defeito" "TipoDefeito" NOT NULL,
    "descricao_defeito" TEXT NOT NULL,
    "severidade" "Severidade" NOT NULL,
    "status" "StatusSinistro" NOT NULL DEFAULT 'ABERTO',
    "laudo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sinistros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sinistros_numero_serie_idx" ON "sinistros"("numero_serie");

-- CreateIndex
CREATE INDEX "sinistros_status_idx" ON "sinistros"("status");
