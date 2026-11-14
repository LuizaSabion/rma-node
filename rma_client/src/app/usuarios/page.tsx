import { redirect } from 'next/navigation';
import { buscarUsuarios, usuarioLogado } from '@/features/auth/api/auth.http';
import UsuariosAdmin from '@/features/auth/components/UsuariosAdmin';
import { sair } from '@/features/auth/api/auth.actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export default async function UsuariosPage() {
  const usuario = await usuarioLogado();
  if (usuario.perfil !== 'ADMINISTRADOR') redirect('/sinistro');
  const usuarios = await buscarUsuarios();
  return <>
    <div className="mb-5 flex items-center justify-between gap-3"><Link href="/sinistro" className="underline">Voltar à fila</Link><form action={sair}><button className="underline">Sair</button></form></div>
    <UsuariosAdmin usuarios={usuarios} meuId={usuario.id}/>
  </>;
}
