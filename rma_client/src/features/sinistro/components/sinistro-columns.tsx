import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ClipboardCheck, FileText, FlaskConical, PencilIcon, Trash2 } from 'lucide-react';
import { Sinistro } from '../type/sinistro.type';
import { SeveridadeTag, StatusBadge } from './StatusBadge';

interface SinistroColumnsProps {
  onEdit: (sinistro: Sinistro) => void;
  onDelete: (sinistro: Sinistro) => void;
  onEnviarLaboratorio: (sinistro: Sinistro) => void;
  onLaudo: (sinistro: Sinistro) => void;
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const getSinistroColumns = ({
  onEdit,
  onDelete,
  onEnviarLaboratorio,
  onLaudo,
}: SinistroColumnsProps): ColumnDef<Sinistro>[] => [
  {
    accessorKey: 'id',
    header: 'RMA',
    cell: ({ row }) => (
      <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
        #{row.original.id.slice(0, 8).toUpperCase()}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'cliente',
    header: ({ column }) => (
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1"
        onClick={() => column.toggleSorting()}
      >
        Cliente <ArrowUpDown className="size-3" />
      </button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.cliente}</span>,
  },
  {
    accessorKey: 'dispositivo',
    header: 'Aparelho',
    cell: ({ row }) => (
      <div>
        <div>{row.original.dispositivo}</div>
        <div className="font-mono text-xs text-muted-foreground">{row.original.numeroSerie}</div>
      </div>
    ),
  },
  {
    accessorKey: 'tipoDefeitoNome',
    header: 'Defeito',
  },
  {
    accessorKey: 'severidade',
    header: 'Severidade',
    cell: ({ row }) => <SeveridadeTag severidade={row.original.severidade} />,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: 'equals',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1"
        onClick={() => column.toggleSorting()}
      >
        Aberto em <ArrowUpDown className="size-3" />
      </button>
    ),
    cell: ({ row }) => <span className="whitespace-nowrap">{formatarData(row.original.createdAt)}</span>,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => {
      const sinistro = row.original;
      const aberto = sinistro.status === 'ABERTO';
      const noLaboratorio = sinistro.status === 'EM_LABORATORIO';

      return (
        <div className="flex justify-end gap-1 whitespace-nowrap">
          {aberto && (
            <>
              <Button variant="outline" size="icon" title="Alterar" onClick={() => onEdit(sinistro)}>
                <PencilIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Enviar ao laboratório"
                onClick={() => onEnviarLaboratorio(sinistro)}
              >
                <FlaskConical />
              </Button>
            </>
          )}
          {noLaboratorio && (
            <Button variant="secondary" size="sm" onClick={() => onLaudo(sinistro)}>
              <ClipboardCheck /> Laudo
            </Button>
          )}
          {!aberto && !noLaboratorio && (
            <Button variant="ghost" size="icon" title="Ver laudo" onClick={() => onLaudo(sinistro)}>
              <FileText />
            </Button>
          )}
          {!noLaboratorio && (
            <Button
              variant="ghost"
              size="icon"
              title="Excluir"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(sinistro)}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      );
    },
  },
];
