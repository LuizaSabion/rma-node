import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useActionState } from 'react';
import { deleteSinistro } from '../api/sinistro.actions';
import { InitialActionSinistroState, SinistroActionDialogProps } from '../type/sinistro.type';

export function SinistroDeleteDialog({ isOpen, onOpenChange, sinistro, onFeedback }: SinistroActionDialogProps) {
  const [state, formAction, isPending] = useActionState(deleteSinistro, InitialActionSinistroState);

  React.useEffect(() => {
    if (!state?.message) return;

    onOpenChange(false);
    onFeedback({ type: state.success ? 'success' : 'error', message: state.message });
  }, [state, onOpenChange, onFeedback]);

  const confirmar = () => {
    if (!sinistro) return;
    React.startTransition(() => {
      formAction(sinistro.id);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Excluir sinistro?</DialogTitle>
          <DialogDescription>
            O pedido de {sinistro?.cliente} ({sinistro?.numeroSerie}) será apagado do banco. Essa ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={confirmar} disabled={isPending}>
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
