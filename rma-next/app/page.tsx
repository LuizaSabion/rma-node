'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DEFEITOS, STATUS_LISTA, Sinistro, excluirSinistro, listarSinistros } from '../lib/api';

export default function ListaSinistrosPage() {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      setSinistros(await listarSinistros(filtro));
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  async function excluir(id: string) {
    if (!window.confirm('Excluir esse sinistro?')) return;

    try {
      await excluirSinistro(id);
      await carregar();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const nomeDefeito = (v: string) => DEFEITOS.find((d) => d.valor === v)?.nome ?? v;
  const nomeStatus = (v: string) => STATUS_LISTA.find((s) => s.valor === v)?.nome ?? v;

  return (
    <div className="painel">
      <div className="cabecalho">
        <h2>📦 Sinistros</h2>
        <div className="ferramentas">
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="TODOS">Todos</option>
            {STATUS_LISTA.map((s) => (
              <option key={s.valor} value={s.valor}>{s.nome}</option>
            ))}
          </select>
          <Link href="/sinistros/novo" className="btn primario">+ Abrir sinistro</Link>
        </div>
      </div>

      {erro && <p className="erro">{erro}</p>}
      {carregando && <p className="vazio">Carregando...</p>}
      {!carregando && !erro && sinistros.length === 0 && <p className="vazio">Nenhum sinistro encontrado.</p>}

      {sinistros.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Cliente / aparelho</th>
              <th>Nº série</th>
              <th>Defeito</th>
              <th>Severidade</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sinistros.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.cliente}</b>
                  <small>{s.dispositivo || 'sem modelo informado'}</small>
                </td>
                <td>{s.numeroSerie}</td>
                <td>
                  {nomeDefeito(s.tipoDefeito)}
                  <small>{s.descricaoDefeito}</small>
                  {s.laudo && <small>Laudo: {s.laudo}</small>}
                </td>
                <td><span className={`tag ${s.severidade}`}>{s.severidade}</span></td>
                <td><span className={`tag ${s.status}`}>{nomeStatus(s.status)}</span></td>
                <td>
                  <div className="acoes">
                    <Link href={`/sinistros/${s.id}/editar`} className="btn">Alterar</Link>
                    <button className="btn perigo" onClick={() => excluir(s.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
