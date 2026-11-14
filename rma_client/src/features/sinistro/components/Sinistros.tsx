'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, CheckCircle2, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { concluirReparo, enviarLaboratorio } from '../api/sinistro.actions';
import { SinistroFormData } from '../schema/sinistro.schema';
import { Estatisticas, Feedback, InitialActionSinistroState, Sinistro, StatusSinistro } from '../type/sinistro.type';
import { EstatisticasCards } from './EstatisticasCards';
import { LaudoDialog } from './LaudoDialog';
import { getSinistroColumns } from './sinistro-columns';
import { SinistroCreateDialog } from './SinistroCreateDialog';
import { SinistroDeleteDialog } from './SinistroDeleteDialog';
import { SinistroUpdateDialog } from './SinistroUpdateDialog';

export interface SinistroProps {
  sinistros: Sinistro[];
  estatisticas: Estatisticas | null;
}

export default function SinistrosPages({ sinistros, estatisticas }: SinistroProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLaudoOpen, setIsLaudoOpen] = useState(false);
  const [selectedSinistro, setSelectedSinistro] = useState<Sinistro | null>(null);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleFeedback = useCallback((f: Feedback) => setFeedback(f), []);

  const handleOpenUpdate = useCallback((sinistro: Sinistro) => {
    setSelectedSinistro(sinistro);
    setIsUpdateOpen(true);
  }, []);

  const handleOpenDelete = useCallback((sinistro: Sinistro) => {
    setSelectedSinistro(sinistro);
    setIsDeleteOpen(true);
  }, []);

  const handleOpenLaudo = useCallback((sinistro: Sinistro) => {
    setSelectedSinistro(sinistro);
    setIsLaudoOpen(true);
  }, []);

  const handleEnviarLaboratorio = useCallback((sinistro: Sinistro) => {
    startTransition(async () => {
      const resultado = await enviarLaboratorio(InitialActionSinistroState, sinistro.id);
      setFeedback({
        type: resultado.success ? 'success' : 'error',
        message: resultado.success
          ? `Aparelho de ${sinistro.cliente} enviado ao laboratório`
          : (resultado.message ?? ''),
      });
    });
  }, []);

  // ETAPA 1 - Confirma a conclusão para não finalizar por clique acidental.
  const handleConcluirReparo = useCallback((sinistro: Sinistro) => {
    if (!window.confirm('Confirma que o reparo e os testes foram concluídos?')) return;
    startTransition(async () => {
      const resultado = await concluirReparo(InitialActionSinistroState, sinistro.id);
      setFeedback({
        type: resultado.success ? 'success' : 'error',
        message: resultado.message ?? 'Erro ao concluir o reparo',
      });
    });
  }, []);

  const columns = useMemo<ColumnDef<Sinistro>[]>(
    () =>
      getSinistroColumns({
        onEdit: handleOpenUpdate,
        onDelete: handleOpenDelete,
        onEnviarLaboratorio: handleEnviarLaboratorio,
        onLaudo: handleOpenLaudo,
        onConcluirReparo: handleConcluirReparo,
      }),
    [handleOpenUpdate, handleOpenDelete, handleEnviarLaboratorio, handleOpenLaudo, handleConcluirReparo],
  );

  const table = useReactTable({
    data: sinistros,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const filtroStatus = (table.getColumn('status')?.getFilterValue() as StatusSinistro | undefined) ?? 'TODOS';

  const filtrarStatus = (status: StatusSinistro | 'TODOS') => {
    table.getColumn('status')?.setFilterValue(status === 'TODOS' ? undefined : status);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fila de sinistros</h1>
          <p className="text-sm text-muted-foreground">
            Pedidos de garantia ordenados por severidade e data de abertura.
          </p>
        </div>
        <Button size="lg" className="px-4" onClick={() => setIsCreateOpen(true)}>
          <Plus /> Novo pedido
        </Button>
      </div>

      {/* Barra de alert feedback */}
      {feedback && (
        <Alert
          variant={feedback.type === 'error' ? 'destructive' : 'default'}
          className={
            feedback.type === 'success' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-destructive'
          }
        >
          {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{feedback.type === 'success' ? 'Sucesso' : 'Atenção'}</AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}

      <EstatisticasCards dados={estatisticas} filtroAtual={filtroStatus} onFiltrar={filtrarStatus} />

      {/* Filtro */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar por cliente, aparelho ou número de série"
          className="bg-white pl-9"
        />
      </div>

      {/* tabela do datatable */}
      <div className="w-full overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headers) => (
              <TableRow key={headers.id}>
                {headers.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Nenhum sinistro encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            {table.getFilteredRowModel().rows.length} registro(s) — página {table.getState().pagination.pageIndex + 1}{' '}
            de {Math.max(table.getPageCount(), 1)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Próxima
            </Button>
          </div>
        </div>
      </div>

      <SinistroCreateDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        sinistroEdit={null}
        onFeedback={handleFeedback}
      />

      <SinistroUpdateDialog
        isOpen={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        sinistroEdit={selectedSinistro as (SinistroFormData & { id: string }) | null}
        onFeedback={handleFeedback}
      />

      <SinistroDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        sinistro={selectedSinistro}
        onFeedback={handleFeedback}
      />

      <LaudoDialog
        isOpen={isLaudoOpen}
        onOpenChange={setIsLaudoOpen}
        sinistro={selectedSinistro}
        onFeedback={handleFeedback}
      />
    </div>
  );
}
