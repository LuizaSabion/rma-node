import { fetchEstatisticas, fetchSinistros } from '@/features/sinistro/api/fetch.sinistros';
import SinistrosPages from '@/features/sinistro/components/Sinistros';

export const dynamic = 'force-dynamic';

export default async function sinistrosPages() {
  const [sinistros, estatisticas] = await Promise.all([fetchSinistros(), fetchEstatisticas()]);
  return <SinistrosPages sinistros={sinistros} estatisticas={estatisticas} />;
}
