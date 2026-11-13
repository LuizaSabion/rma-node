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
import { createSinistro } from '../api/sinistro.actions';
import { SinistroFormData, sinistroSchema } from '../schema/sinistro.schema';
import { InitialActionSinistroState, SinistroFormDialogProps } from '../type/sinistro.type';
import { SinistroFormFields } from './SinistroFormFields';

const valoresVazios: SinistroFormData = {
  cliente: '',
  dispositivo: '',
  numeroSerie: '',
  tipoDefeito: '' as SinistroFormData['tipoDefeito'],
  descricaoDefeito: '',
  severidade: '',
};

export function SinistroCreateDialog({ isOpen, onOpenChange, onFeedback }: SinistroFormDialogProps) {
  const [state, formAction, isPending] = useActionState(createSinistro, InitialActionSinistroState);

  const form = useForm<SinistroFormData>({
    resolver: zodResolver(sinistroSchema),
    defaultValues: valoresVazios,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(valoresVazios);
    }
  }, [isOpen, form]);

  React.useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      onOpenChange(false);
    }
    onFeedback({ type: state.success ? 'success' : 'error', message: state.message });
  }, [state, onOpenChange, onFeedback]);

  const onSubmit = (sinistro: SinistroFormData) => {
    React.startTransition(() => {
      formAction(sinistro);
    });
  };

  const isBusy = isPending || form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Novo pedido de garantia</DialogTitle>
          <DialogDescription>O pedido entra na fila como &quot;Aberto&quot;.</DialogDescription>
        </DialogHeader>
        <form id="form-sinistro-create" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SinistroFormFields control={form.control} disabled={isBusy} />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy ? 'Gravando...' : 'Abrir pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
