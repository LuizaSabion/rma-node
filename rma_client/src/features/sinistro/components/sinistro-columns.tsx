import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ClipboardCheck, FileText, FlaskConical, PencilIcon, Trash2, Wrench, ShieldCheck } from 'lucide-react';
import { Sinistro } from '../type/sinistro.type';
import type { Usuario } from '@/features/auth/type/auth.type';
import { SeveridadeTag, StatusBadge } from './StatusBadge';

interface SinistroColumnsProps {
  // ETAPA 3 - Exibir somente acoes coerentes com o perfil, mas backend valida novamente.
  usuario: Usuario;
  onAtribuir: (sinistro: Sinistro) => void;
  onTransferir: (sinistro: Sinistro) => void;
  onEdit: (sinistro: Sinistro) => void;
  onDelete: (sinistro: Sinistro) => void;
  onEnviarLaboratorio: (sinistro: Sinistro) => void;
  onLaudo: (sinistro: Sinistro) => void;
  // ETAPA 2 - Acao para anexar e conferir o comprovante de compra.
  onComprovante: (sinistro: Sinistro) => void;
  // ETAPA 1 - Ação separada de finalização do reparo.
  onConcluirReparo: (sinistro: Sinistro) => void;
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
  usuario, onAtribuir, onTransferir,
  onEdit,
  onDelete,
  onEnviarLaboratorio,
  onLaudo,
  onComprovante,
  onConcluirReparo,
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
    cell: ({ row }) => (
      <div>
        <StatusBadge status={row.original.status} />
        {/* ETAPA 2 - Exibe o motivo calculado, sem precisar abrir o banco. */}
        {row.original.motivoReprovacao && <p className="mt-1 max-w-44 text-xs text-muted-foreground">{row.original.motivoReprovacao}</p>}
      </div>
    ),
    filterFn: 'equals',
  },
  {
    accessorKey: 'tecnicoResponsavelNome',
    header: 'Técnico',
    cell: ({ row }) => <span className="text-xs">{row.original.tecnicoResponsavelNome || 'Não atribuído'}</span>,
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
      const pendente = sinistro.status === 'PENDENTE_COMPROVACAO';
      const noLaboratorio = sinistro.status === 'EM_LABORATORIO';
      const emReparo = sinistro.status === 'EM_REPARO';
      // ETAPA 3 - Interface reflete RBAC real verificado no backend.
      const atendente = usuario.perfil === 'ATENDENTE';
      const administrador = usuario.perfil === 'ADMINISTRADOR';
      const tecnicoResponsavel = usuario.perfil === 'TECNICO' && sinistro.tecnicoResponsavelId === usuario.id;
      const semTecnico = !sinistro.tecnicoResponsavelId;
      const emAtendimento = noLaboratorio || emReparo;

      return (
        <div className="flex justify-end gap-1 whitespace-nowrap">
          {/* ETAPA 2 - Um pedido pendente precisa permitir anexar e conferir NF. */}
          {atendente && (aberto || pendente) && !sinistro.comprovanteConferidoEm && (
            <Button variant="outline" size="sm" title="Nota fiscal / comprovante" onClick={() => onComprovante(sinistro)}>
              <ShieldCheck /> Comprovante
            </Button>
          )}
          {atendente && (aberto || pendente) && (
            <Button variant="outline" size="icon" title="Alterar" onClick={() => onEdit(sinistro)}><PencilIcon /></Button>
          )}
          {atendente && aberto && (
            <>
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
          {noLaboratorio && tecnicoResponsavel && (
            <Button variant="secondary" size="sm" onClick={() => onLaudo(sinistro)}>
              <ClipboardCheck /> Laudo
            </Button>
          )}
          {/* ETAPA 1 - Só é possível concluir reparos que estejam EM_REPARO. */}
          {emReparo && tecnicoResponsavel && (
            <Button variant="secondary" size="sm" onClick={() => onConcluirReparo(sinistro)}>
              <Wrench /> Concluir reparo
            </Button>
          )}
          {/* ETAPA 3 - Atribuicao inicial: atendente/admin escolhe; tecnico assume apenas a si. */}
          {noLaboratorio && semTecnico && (
            <Button variant="outline" size="sm" onClick={() => onAtribuir(sinistro)}>
              {usuario.perfil === 'TECNICO' ? 'Assumir' : 'Atribuir técnico'}
            </Button>
          )}
          {administrador && emAtendimento && !semTecnico && (
            <Button variant="outline" size="sm" onClick={() => onTransferir(sinistro)}>Transferir</Button>
          )}
          {!aberto && !pendente && !noLaboratorio && (

            <Button variant="ghost" size="icon" title="Ver laudo" onClick={() => onLaudo(sinistro)}>
              <FileText />
            </Button>
          )}
          {atendente && !noLaboratorio && !emReparo && (
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
