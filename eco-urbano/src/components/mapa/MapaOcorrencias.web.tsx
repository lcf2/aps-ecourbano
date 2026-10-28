import { View, StyleSheet } from 'react-native';
import { EstadoVazio } from '@/components/ui/EstadoTela';
import { Tema } from '@/theme';
import type { Localidade } from '@/types/localidade';
import type { Ocorrencia } from '@/types/ocorrencia';

interface Props {
  ocorrencias: Ocorrencia[];
  localidade: Localidade;
}

export function MapaOcorrencias({ ocorrencias }: Props) {
  return (
    <View style={estilos.web}>
      <EstadoVazio
        icone="map-outline"
        titulo="Mapa no dispositivo"
        descricao={
          ocorrencias.length === 0
            ? 'A visualização geográfica usa o mapa nativo (Android ou iOS). No navegador, cadastre ocorrências pela lista.'
            : `${ocorrencias.length} ocorrência(s) salva(s). Abra o app no celular para vê-las no mapa.`
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  web: {
    flex: 1,
    padding: Tema.espaco.md,
    backgroundColor: Tema.cores.fundo,
    justifyContent: 'center',
  },
});
