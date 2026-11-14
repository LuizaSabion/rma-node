import { cn } from '@/lib/utils';
import { NOMES_SEVERIDADE, NOMES_STATUS, Severidade, StatusSinistro } from '../type/sinistro.type';

const CORES_STATUS: Record<StatusSinistro, string> = {
  ABERTO: 'bg-sky-50 text-sky-800 border-sky-200',
  EM_LABORATORIO: 'bg-amber-50 text-amber-800 border-amber-300',
  // ETAPA 1 - Cor identificando a etapa de manutenção em andamento.
  EM_REPARO: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  REPARADO: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  SUBSTITUIDO: 'bg-violet-50 text-violet-800 border-violet-200',
  REPROVADO: 'bg-rose-50 text-rose-800 border-rose-200',
};

export function StatusBadge({ status }: { status: StatusSinistro }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        CORES_STATUS[status],
      )}
    >
      {NOMES_STATUS[status]}
    </span>
  );
}

const CORES_SEVERIDADE: Record<Severidade, string> = {
  ALTA: 'bg-red-500',
  MEDIA: 'bg-amber-400',
  BAIXA: 'bg-stone-400',
};

export function SeveridadeTag({ severidade }: { severidade: Severidade }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn('size-2 rounded-full', CORES_SEVERIDADE[severidade])} />
      {NOMES_SEVERIDADE[severidade]}
    </span>
  );
}
