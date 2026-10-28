import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Ocorrencia } from '@/types/ocorrencia';

const CHAVE = '@eco-urbano/ocorrencias';

type OcorrenciaPersistida = Omit<Ocorrencia, 'criadoEm'> & { criadoEm: string };

function hidratar(item: OcorrenciaPersistida & Partial<Pick<Ocorrencia, 'titulo'>>): Ocorrencia {
  return {
    ...item,
    titulo: item.titulo ?? item.descricao,
    criadoEm: new Date(item.criadoEm),
  };
}

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) {
    return [];
  }

  const lista = JSON.parse(bruto) as OcorrenciaPersistida[];
  return lista
    .map(hidratar)
    .sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());
}

export async function obterOcorrencia(id: string): Promise<Ocorrencia | null> {
  const lista = await listarOcorrencias();
  return lista.find((item) => item.id === id) ?? null;
}

export async function salvarOcorrencia(ocorrencia: Ocorrencia): Promise<void> {
  const lista = await listarOcorrencias();
  const proxima = [ocorrencia, ...lista.filter((item) => item.id !== ocorrencia.id)];
  await AsyncStorage.setItem(CHAVE, JSON.stringify(proxima));
}
