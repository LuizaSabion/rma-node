import { fetchEstatisticas, fetchSinistros } from '@/features/sinistro/api/fetch.sinistros';
import SinistrosPages from '@/features/sinistro/components/Sinistros';
import { usuarioLogado, buscarTecnicos } from '@/features/auth/api/auth.http';

export const dynamic = 'force-dynamic';

export default async function sinistrosPages() {
  // ETAPA 3 - Identidade vem do backend; sem sessao, redirecionamos ao login.
  const usuario = await usuarioLogado();
  const [sinistros, estatisticas, tecnicos] = await Promise.all([fetchSinistros(), fetchEstatisticas(), buscarTecnicos()]);
  return <SinistrosPages sinistros={sinistros} estatisticas={estatisticas} usuario={usuario} tecnicos={tecnicos} />;
}
