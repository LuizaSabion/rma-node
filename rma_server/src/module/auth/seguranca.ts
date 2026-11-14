import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

// ETAPA 3 - Somente dados criptograficos sao persistidos. Nunca gravar senha/token bruto.
export function hashSenha(senha: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(senha, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verificarSenha(senha: string, armazenado: string): boolean {
  const partes = armazenado.split(':');
  if (partes.length !== 2 || !/^[a-f0-9]{32}$/.test(partes[0]) || !/^[a-f0-9]{128}$/.test(partes[1])) return false;
  const hash = scryptSync(senha, Buffer.from(partes[0], 'hex'), 64);
  return timingSafeEqual(hash, Buffer.from(partes[1], 'hex'));
}

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const novoToken = () => randomBytes(32).toString('hex');
