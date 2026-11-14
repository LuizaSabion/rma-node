'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { atribuirTecnico, transferirTecnico } from '../api/sinistro.actions';
import type { Feedback, Sinistro } from '../type/sinistro.type';
import type { Tecnico, Usuario } from '@/features/auth/type/auth.type';

type Props = { sinistro: Sinistro | null; open: boolean; onOpenChange: (o: boolean) => void;
  usuario: Usuario; tecnicos: Tecnico[]; onFeedback: (f: Feedback) => void; modo: 'atribuir'|'transferir' };

export function TecnicoDialog({ sinistro, open, onOpenChange, usuario, tecnicos, onFeedback, modo }: Props) {
  const [tecnicoId, setTecnicoId] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [ocupado, setOcupado] = useState(false);
  useEffect(() => { setTecnicoId(''); setJustificativa(''); }, [open, sinistro?.id]);
  if (!sinistro) return null;
  const souTecnico = usuario.perfil === 'TECNICO';
  const enviar = async () => {
    setOcupado(true);
    try {
      const res = modo === 'transferir'
        ? await transferirTecnico(sinistro.id, tecnicoId, justificativa)
        : await atribuirTecnico(sinistro.id, souTecnico ? usuario.id : tecnicoId);
      onFeedback({ type: res.success ? 'success' : 'error', message: res.message ?? 'Falha ao atribuir.' });
      if (res.success) onOpenChange(false);
    } finally { setOcupado(false); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>
    <DialogHeader><DialogTitle>{modo==='transferir'?'Transferir responsabilidade':'Atribuir técnico'}</DialogTitle>
      <DialogDescription>Sinistro #{sinistro.id.slice(0,8).toUpperCase()}</DialogDescription></DialogHeader>
    {souTecnico ? <p>Você está prestes a assumir este sinistro.</p> : <label className="space-y-1 text-sm">Técnico responsável
      <select className="w-full rounded-md border bg-background p-2" value={tecnicoId} onChange={e=>setTecnicoId(e.target.value)}>
        <option value="">Selecione um técnico</option>{tecnicos.filter(t=>t.id!==sinistro.tecnicoResponsavelId).map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}
      </select></label>}
    {modo==='transferir' && <label className="space-y-1 text-sm">Justificativa da transferência
      <textarea className="min-h-20 w-full rounded-md border p-2" value={justificativa} onChange={e=>setJustificativa(e.target.value)} minLength={10} required /></label>}
    <div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>onOpenChange(false)}>Cancelar</Button>
      <Button disabled={ocupado || (!souTecnico && !tecnicoId) || (modo==='transferir' && justificativa.trim().length<10)} onClick={enviar}>
        {ocupado?'Salvando...':modo==='transferir'?'Transferir':'Confirmar atribuição'}
      </Button></div>
  </DialogContent></Dialog>;
}
