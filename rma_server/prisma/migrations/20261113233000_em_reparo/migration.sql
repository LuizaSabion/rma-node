-- ETAPA 1: adiciona somente um valor ao ENUM existente; não apaga registros.
ALTER TYPE "StatusSinistro" ADD VALUE IF NOT EXISTS 'EM_REPARO';
