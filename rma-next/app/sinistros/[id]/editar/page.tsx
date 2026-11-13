'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SinistroForm from '../../SinistroForm';
import { Sinistro, SinistroFormData, atualizarSinistro, buscarSinistro } from '../../../../lib/api';

export default function EditarSinistroPage() {
  const { id } = useParams<{ id: string }>();

  const [sinistro, setSinistro] = useState<Sinistro | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarSinistro(id)
      .then(setSinistro)
      .catch((e: any) => setErro(e.message));
  }, [id]);

  function salvar(dados: SinistroFormData) {
    return atualizarSinistro(id, dados);
  }

  return (
    <div>
      <div className="cabecalho">
        <h2>✏️ Alterar sinistro</h2>
        <Link href="/" className="btn">Voltar</Link>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {sinistro && (
        <SinistroForm
          edicao
          textoBotao="Salvar alterações"
          aoSalvar={salvar}
          inicial={{
            cliente: sinistro.cliente,
            dispositivo: sinistro.dispositivo,
            numeroSerie: sinistro.numeroSerie,
            tipoDefeito: sinistro.tipoDefeito,
            descricaoDefeito: sinistro.descricaoDefeito,
            status: sinistro.status,
            laudo: sinistro.laudo,
          }}
        />
      )}
    </div>
  );
}
