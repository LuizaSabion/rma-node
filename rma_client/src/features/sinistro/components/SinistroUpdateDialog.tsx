import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { updateSinistro } from '../api/sinistro.actions';
import { SinistroFormData, sinistroSchema } from '../schema/sinistro.schema';
import { InitialActionSinistroState, SinistroFormDialogProps } from '../type/sinistro.type';
import { SinistroFormFields } from './SinistroFormFields';

export function SinistroUpdateDialog({ isOpen, onOpenChange, sinistroEdit, onFeedback }: SinistroFormDialogProps) {
  const [state, formAction, isPending] = useActionState(updateSinistro, InitialActionSinistroState);

  const form = useForm<SinistroFormData>({
    resolver: zodResolver(sinistroSchema),
  });

  React.useEffect(() => {
    if (isOpen && sinistroEdit) {
      form.reset({
        cliente: sinistroEdit.cliente,
        dispositivo: sinistroEdit.dispositivo,
        numeroSerie: sinistroEdit.numeroSerie,
        tipoDefeito: sinistroEdit.tipoDefeito,
        descricaoDefeito: sinistroEdit.descricaoDefeito,
        severidade: sinistroEdit.severidade,
      });
    }
  }, [isOpen, sinistroEdit, form]);

  React.useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      onOpenChange(false);
    }
    onFeedback({ type: state.success ? 'success' : 'error', message: state.message });
  }, [state, onOpenChange, onFeedback]);

  const onSubmit = (sinistro: SinistroFormData) => {
    if (!sinistroEdit) return;
    React.startTransition(() => {
      formAction({ id: sinistroEdit.id, sinistro });
    });
  };

  const isBusy = isPending || form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Alterar pedido #{sinistroEdit?.id.slice(0, 8).toUpperCase()}</DialogTitle>
          <DialogDescription>Só dá pra alterar enquanto o pedido ainda não foi para o laboratório.</DialogDescription>
        </DialogHeader>
        <form id="form-sinistro-update" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SinistroFormFields control={form.control} disabled={isBusy} />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy ? 'Gravando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
