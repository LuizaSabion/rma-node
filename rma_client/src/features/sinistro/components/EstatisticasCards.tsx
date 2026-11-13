import { cn } from '@/lib/utils';
import { Estatisticas, StatusSinistro } from '../type/sinistro.type';

interface EstatisticasCardsProps {
  dados: Estatisticas | null;
  filtroAtual: StatusSinistro | 'TODOS';
  onFiltrar: (status: StatusSinistro | 'TODOS') => void;
}

export function EstatisticasCards({ dados, filtroAtual, onFiltrar }: EstatisticasCardsProps) {
  const itens: { status: StatusSinistro | 'TODOS'; titulo: string; valor: number; cor: string }[] = [
    { status: 'TODOS', titulo: 'Total', valor: dados?.total ?? 0, cor: 'border-t-stone-500' },
    { status: 'ABERTO', titulo: 'Abertos', valor: dados?.abertos ?? 0, cor: 'border-t-sky-500' },
    { status: 'EM_LABORATORIO', titulo: 'Laboratório', valor: dados?.laboratorio ?? 0, cor: 'border-t-amber-500' },
    { status: 'REPARADO', titulo: 'Reparados', valor: dados?.reparados ?? 0, cor: 'border-t-emerald-500' },
    { status: 'SUBSTITUIDO', titulo: 'Substituídos', valor: dados?.substituidos ?? 0, cor: 'border-t-violet-500' },
    { status: 'REPROVADO', titulo: 'Reprovados', valor: dados?.reprovados ?? 0, cor: 'border-t-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {itens.map((item) => (
        <button
          key={item.status}
          type="button"
          onClick={() => onFiltrar(item.status)}
          className={cn(
            'cursor-pointer rounded-lg border border-t-4 bg-card px-4 py-3 text-left shadow-xs transition hover:shadow-md',
            item.cor,
            filtroAtual === item.status && 'ring-2 ring-primary/60',
          )}
        >
          <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{item.titulo}</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{item.valor}</div>
        </button>
      ))}
    </div>
  );
}
