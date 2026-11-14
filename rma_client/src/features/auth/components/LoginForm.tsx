'use client';

import { useActionState } from 'react';
import { entrar } from '../api/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginForm() {
  const [estado, acao, pendente] = useActionState(entrar, { erro: '' });
  return (
    <form action={acao} className="mx-auto mt-10 max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Acessar RMA Zenith</h1>
      <p className="text-sm text-muted-foreground">Entre com o usuário criado pelo administrador.</p>
      <label className="block space-y-1 text-sm">E-mail<Input type="email" name="email" autoComplete="username" required /></label>
      <label className="block space-y-1 text-sm">Senha<Input type="password" name="senha" autoComplete="current-password" required /></label>
      {estado.erro && <p role="alert" className="text-sm text-destructive">{estado.erro}</p>}
      <Button type="submit" disabled={pendente} className="w-full">{pendente ? 'Entrando...' : 'Entrar'}</Button>
    </form>
  );
}
