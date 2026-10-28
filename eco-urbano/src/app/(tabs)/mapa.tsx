import { MapaOcorrencias } from '@/components/mapa/MapaOcorrencias';
import { useApp } from '@/context/AppContext';

export default function TelaMapa() {
  const { ocorrencias, localidade } = useApp();
  return <MapaOcorrencias ocorrencias={ocorrencias} localidade={localidade} />;
}
