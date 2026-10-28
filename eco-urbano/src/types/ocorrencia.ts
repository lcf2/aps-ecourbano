export type TipoOcorrencia =
  | 'alagamento'
  | 'fumaca'
  | 'descarte_irregular'
  | 'buraco_via'
  | 'desmatamento_urbano'
  | 'outro';

export interface Ocorrencia {
  id: string;
  titulo: string;
  tipo: TipoOcorrencia;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
  criadoEm: Date;
  status: 'ativo' | 'resolvido';
  fotoUrl?: string;
  usuarioId?: string;
}
