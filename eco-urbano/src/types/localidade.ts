export type OrigemLocalidade = 'gps' | 'indefinida';

export interface Localidade {
  latitude: number | null;
  longitude: number | null;
  rotulo: string;
  origem: OrigemLocalidade;
}
