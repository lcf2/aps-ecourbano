import * as Location from 'expo-location';
import type { Localidade } from '@/types/localidade';

export async function obterLocalidadeAtual(): Promise<Localidade> {
  const servicoAtivo = await Location.hasServicesEnabledAsync();
  if (!servicoAtivo) {
    throw new Error(
      'Os serviços de localização estão desativados neste dispositivo.'
    );
  }

  const permissaoAtual = await Location.getForegroundPermissionsAsync();
  let status = permissaoAtual.status;

  if (status !== Location.PermissionStatus.GRANTED) {
    const solicitacao = await Location.requestForegroundPermissionsAsync();
    status = solicitacao.status;
  }

  if (status !== Location.PermissionStatus.GRANTED) {
    throw new Error(
      'A permissão de localização foi recusada. Você ainda pode informar o endereço manualmente ao cadastrar uma ocorrência.'
    );
  }

  const posicao = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
    rotulo: 'Localização atual do dispositivo',
    origem: 'gps',
  };
}
