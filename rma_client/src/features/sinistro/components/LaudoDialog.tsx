import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { emitirLaudo } from '../api/sinistro.actions';
import { LaudoFormData, laudoSchema } from '../schema/sinistro.schema';
import { InitialActionSinistroState, SinistroActionDialogProps } from '../type/sinistro.type';
import { SeveridadeTag, StatusBadge } from './StatusBadge';

const DECISOES = [
  { valor: 'REPARADO', titulo: 'Reparar', texto: 'Conserto em bancada e devolução da mesma unidade.' },
  { valor: 'SUBSTITUIDO', titulo: 'Substituir', texto: 'Envio de uma unidade nova para o cliente.' },
  { valor: 'REPROVADO', titulo: 'Reprovar', texto: 'Defeito não coberto pela garantia (mau uso, queda...).' },
] as const;

export function LaudoDialog({ isOpen, onOpenChange, sinistro, onFeedback }: SinistroActionDialogProps) {
  const [state, formAction, isPending] = useActionState(emitirLaudo, InitialActionSinistroState);

  const form = useForm<LaudoFormData>({
    resolver: zodResolver(laudoSchema),
    defaultValues: { laudo: '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ decisao: undefined, laudo: '' });
    }
  }, [isOpen, form]);

  React.useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      onOpenChange(false);
      // backend trocou pra substituido (limite de reparos)
      const decisao = form.getValues('decisao');
      if (state.data && state.data.status !== decisao) {
        onFeedback({ type: 'success', message: 'Aparelho já teve muitos reparos: virou substituição automática.' });
        return;
      }
    }
    onFeedback({ type: state.success ? 'success' : 'error', message: state.message });
  }, [state, onOpenChange, onFeedback, form]);

  const onSubmit = (laudo: LaudoFormData) => {
    if (!sinistro) return;
    React.startTransition(() => {
      formAction({ id: sinistro.id, laudo });
    });
  };

  if (!sinistro) return null;
  const podeEmitir = sinistro.status === 'EM_LABORATORIO';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>Laudo técnico</DialogTitle>
            <StatusBadge status={sinistro.status} />
          </div>
          <DialogDescription>RMA #{sinistro.id.slice(0, 8).toUpperCase()}</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 rounded-lg bg-muted/60 p-4 text-sm sm:grid-cols-2">
          <Info titulo="Cliente">{sinistro.cliente}</Info>
          <Info titulo="Aparelho">
            {sinistro.dispositivo} <span className="font-mono text-muted-foreground">({sinistro.numeroSerie})</span>
          </Info>
          <Info titulo="Defeito">{sinistro.tipoDefeitoNome}</Info>
          <Info titulo="Severidade">
            <SeveridadeTag severidade={sinistro.severidade} />
          </Info>
          <div className="sm:col-span-2">
            <Info titulo="Relato do cliente">{sinistro.descricaoDefeito}</Info>
          </div>
          {sinistro.laudo && (
            <div className="rounded-md border-l-4 border-primary bg-card p-3 sm:col-span-2">
              <Info titulo="Laudo do laboratório">{sinistro.laudo}</Info>
            </div>
          )}
        </dl>

        {podeEmitir ? (
          <form id="form-laudo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="decisao"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Decisão</FieldLabel>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {DECISOES.map((d) => (
                      <button
                        key={d.valor}
                        type="button"
                        onClick={() => field.onChange(d.valor)}
                        className={cn(
                          'cursor-pointer rounded-lg border p-3 text-left transition hover:border-primary',
                          field.value === d.valor && 'border-primary bg-accent ring-2 ring-primary/40',
                        )}
                      >
                        <div className="font-medium text-foreground">{d.titulo}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{d.texto}</div>
                      </button>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="laudo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="laudo">Parecer técnico</FieldLabel>
                  <Textarea
                    {...field}
                    id="laudo"
                    rows={3}
                    placeholder="O que foi encontrado e o que foi feito"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Voltar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Emitir laudo'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Info({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{titulo}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
