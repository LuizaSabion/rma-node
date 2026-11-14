-- ETAPA 2: nao apagamos nem recriamos os sinistros existentes.
ALTER TYPE "StatusSinistro" ADD VALUE IF NOT EXISTS 'PENDENTE_COMPROVACAO' BEFORE 'ABERTO';

CREATE TYPE "TipoDispositivo" AS ENUM ('FONE_COM_FIO', 'CELULAR', 'FONE_BLUETOOTH', 'NOTEBOOK');

ALTER TABLE "sinistros" ADD COLUMN "tipo_dispositivo" "TipoDispositivo";
ALTER TABLE "sinistros" ADD COLUMN "motivo_reprovacao" TEXT;
ALTER TABLE "sinistros" ALTER COLUMN "status" SET DEFAULT 'PENDENTE_COMPROVACAO';

CREATE TABLE "comprovantes_garantia" (
  "id" TEXT NOT NULL,
  "sinistro_id" TEXT NOT NULL,
  "nome_arquivo" TEXT NOT NULL,
  "tipo_mime" TEXT NOT NULL,
  "arquivo" BYTEA NOT NULL,
  "data_compra" DATE NOT NULL,
  "numero_documento" TEXT,
  "prazo_garantia_meses" INTEGER,
  "data_vencimento" DATE,
  "confirmado_em" TIMESTAMP(3),
  "anexado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "comprovantes_garantia_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "comprovantes_garantia_sinistro_id_key" ON "comprovantes_garantia"("sinistro_id");
ALTER TABLE "comprovantes_garantia" ADD CONSTRAINT "comprovantes_garantia_sinistro_id_fkey" FOREIGN KEY ("sinistro_id") REFERENCES "sinistros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Sinistros antigos em ABERTO continuam como estavam, mas a guarda no
-- backend bloqueia seu envio ao laboratorio ate terem comprovante validado.
