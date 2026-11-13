'use client';

import Link from 'next/link';
import SinistroForm from '../SinistroForm';
import { criarSinistro } from '../../../lib/api';

export default function NovoSinistroPage() {
  return (
    <div>
      <div className="cabecalho">
        <h2>🗂️ Abrir sinistro</h2>
        <Link href="/" className="btn">Voltar</Link>
      </div>
      <SinistroForm textoBotao="Abrir sinistro" aoSalvar={criarSinistro} />
    </div>
  );
}
