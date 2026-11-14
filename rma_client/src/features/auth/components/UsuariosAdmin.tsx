'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cadastrarUsuario, editarUsuario } from '../api/auth.actions';
import type { Perfil, UsuarioCadastro } from '../type/auth.type';

const perfis: Perfil[] = ['ATENDENTE', 'TECNICO', 'ADMINISTRADOR'];

export default function UsuariosAdmin({ usuarios, meuId }: { usuarios: UsuarioCadastro[]; meuId: string }) {
  const [mensagem, setMensagem] = useState('');
  const [pendente, iniciar] = useTransition();
  // ETAPA 3 - Cadastro e gestao apenas pelo admin. Nenhuma senha aparece na listagem.
  const criar = (dados: FormData) => {
    iniciar(async () => { const res = await cadastrarUsuario(dados); setMensagem(res.mensagem); });
  };
  const mudar = (id: string, alteracoes: { perfil?: Perfil; ativo?: boolean }) => {
    iniciar(async () => { const res = await editarUsuario(id, alteracoes); setMensagem(res.mensagem); });
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usuários e permissões</h1>
      {mensagem && <p role="status" className="rounded border p-3 text-sm">{mensagem}</p>}
      <form action={criar} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">Cadastrar funcionário</h2>
        <label className="text-sm">Nome<Input name="nome" minLength={3} required /></label>
        <label className="text-sm">E-mail<Input name="email" type="email" required /></label>
        <label className="text-sm">Senha inicial (10+ caracteres)<Input name="senha" type="password" minLength={10} autoComplete="new-password" required /></label>
        <label className="text-sm">Perfil
          <select name="perfil" defaultValue="ATENDENTE" className="block h-10 w-full rounded-md border bg-background px-3">
            {perfis.map((perfil) => <option key={perfil} value={perfil}>{perfil}</option>)}
          </select>
        </label>
        <Button type="submit" disabled={pendente} className="sm:col-span-2">Criar usuário</Button>
      </form>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-3">Funcionário</th><th className="p-3">Perfil</th><th className="p-3">Situação</th><th className="p-3">Ação</th></tr></thead>
        <tbody>{usuarios.map((u) => <tr className="border-b" key={u.id}>
          <td className="p-3"><strong>{u.nome}</strong><div className="text-muted-foreground">{u.email}</div></td>
          <td className="p-3"><select aria-label={`Perfil de ${u.nome}`} defaultValue={u.perfil} disabled={pendente || u.id===meuId}
            key={`${u.id}-${u.perfil}`} onChange={(e) => mudar(u.id,{ perfil: e.target.value as Perfil })} className="rounded border bg-background p-2">
            {perfis.map((perfil) => <option key={perfil}>{perfil}</option>)}</select></td>
          <td className="p-3">{u.ativo ? 'Ativo' : 'Inativo'}</td>
          <td className="p-3"><Button type="button" variant="outline" size="sm" disabled={pendente || u.id === meuId}
            onClick={() => mudar(u.id, { ativo: !u.ativo })}>{u.ativo ? 'Desativar' : 'Ativar'}</Button></td>
        </tr>)}</tbody></table>
      </div>
      <p className="text-xs text-muted-foreground">Alterar perfil ou desativar revoga as sessões do funcionário. Não é permitido desativar técnico com sinistros em andamento.</p>
    </div>
  );
}
