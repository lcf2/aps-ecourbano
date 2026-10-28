import { TiposOcorrencia } from '@/constants/tiposOcorrencia';
import type { TipoOcorrencia } from '@/types/ocorrencia';

export function formatarDataHora(valor: Date | string): string {
  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return 'Data indisponível';
  }
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatarCoordenadas(
  latitude: number | null,
  longitude: number | null
): string {
  if (latitude === null || longitude === null) {
    return 'Coordenadas não informadas';
  }
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function rotuloTipo(tipo: TipoOcorrencia): string {
  return TiposOcorrencia[tipo].label;
}

export function validarLatitude(valor: number): boolean {
  return Number.isFinite(valor) && valor >= -90 && valor <= 90;
}

export function validarLongitude(valor: number): boolean {
  return Number.isFinite(valor) && valor >= -180 && valor <= 180;
}
