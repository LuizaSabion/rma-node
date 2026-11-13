'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFEITOS, STATUS_LISTA, SinistroFormData, StatusSinistro, TipoDefeito } from '../../lib/api';

interface Props {
  inicial?: SinistroFormData;
  edicao?: boolean;
  textoBotao: string;
  aoSalvar: (dados: SinistroFormData) => Promise<unknown>;
}

export default function SinistroForm({ inicial, edicao, textoBotao, aoSalvar }: Props) {
  const router = useRouter();

  const [cliente, setCliente] = useState(inicial?.cliente ?? '');
  const [dispositivo, setDispositivo] = useState(inicial?.dispositivo ?? '');
  const [numeroSerie, setNumeroSerie] = useState(inicial?.numeroSerie ?? '');
  const [tipoDefeito, setTipoDefeito] = useState<TipoDefeito>(inicial?.tipoDefeito ?? 'TELA');
  const [descricaoDefeito, setDescricaoDefeito] = useState(inicial?.descricaoDefeito ?? '');
  const [status, setStatus] = useState<StatusSinistro>(inicial?.status ?? 'ABERTO');
  const [laudo, setLaudo] = useState(inicial?.laudo ?? '');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      await aoSalvar({
        cliente,
        dispositivo,
        numeroSerie,
        tipoDefeito,
        descricaoDefeito,
        status: edicao ? status : undefined,
        laudo: edicao ? laudo : undefined,
      });
      router.push('/');
    } catch (e: any) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="painel">
      <div className="grade">
        <label>Cliente
          <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" required />
        </label>

        <label>Dispositivo
          <input value={dispositivo} onChange={(e) => setDispositivo(e.target.value)} placeholder="Ex: Smartphone Zenith X200" />
        </label>

        <label>Número de série
          <input value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} placeholder="Ex: SNX20099" required />
        </label>

        <label>Tipo de defeito
          <select value={tipoDefeito} onChange={(e) => setTipoDefeito(e.target.value as TipoDefeito)}>
            {DEFEITOS.map((d) => (
              <option key={d.valor} value={d.valor}>{d.nome}</option>
            ))}
          </select>
        </label>

        <label className="largo">Descrição do defeito
          <textarea
            rows={3}
            value={descricaoDefeito}
            onChange={(e) => setDescricaoDefeito(e.target.value)}
            placeholder="Explique o problema relatado"
            required
          />
        </label>

        {edicao && (
          <>
            <label>Status
              <select value={status} onChange={(e) => setStatus(e.target.value as StatusSinistro)}>
                {STATUS_LISTA.map((s) => (
                  <option key={s.valor} value={s.valor}>{s.nome}</option>
                ))}
              </select>
            </label>

            <label className="largo">Laudo técnico
              <textarea
                rows={3}
                value={laudo}
                onChange={(e) => setLaudo(e.target.value)}
                placeholder="Obrigatório para reparado, substituído ou reprovado"
              />
            </label>
          </>
        )}
      </div>

      {erro && <p className="erro">{erro}</p>}

      <button type="submit" className="btn primario" disabled={enviando}>
        {enviando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  );
}
