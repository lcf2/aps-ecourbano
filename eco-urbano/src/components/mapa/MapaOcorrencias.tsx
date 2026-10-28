import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { TiposOcorrencia } from '@/constants/tiposOcorrencia';
import { Tema } from '@/theme';
import type { Localidade } from '@/types/localidade';
import type { Ocorrencia } from '@/types/ocorrencia';

interface Props {
  ocorrencias: Ocorrencia[];
  localidade: Localidade;
}

export function MapaOcorrencias({ ocorrencias, localidade }: Props) {
  const router = useRouter();
  const comCoordenadas = ocorrencias.filter(
    (item) => item.latitude !== 0 || item.longitude !== 0
  );

  const regio = useMemo(() => {
    if (localidade.latitude !== null && localidade.longitude !== null) {
      return {
        latitude: localidade.latitude,
        longitude: localidade.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    if (comCoordenadas[0]) {
      return {
        latitude: comCoordenadas[0].latitude,
        longitude: comCoordenadas[0].longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    return {
      latitude: -14.235,
      longitude: -51.9253,
      latitudeDelta: 40,
      longitudeDelta: 40,
    };
  }, [localidade, comCoordenadas]);

  return (
    <View style={estilos.flex}>
      <MapView
        style={estilos.flex}
        provider={PROVIDER_DEFAULT}
        initialRegion={regio}
        accessibilityLabel="Mapa de ocorrências ambientais"
      >
        {localidade.latitude !== null && localidade.longitude !== null ? (
          <Marker
            coordinate={{
              latitude: localidade.latitude,
              longitude: localidade.longitude,
            }}
            title="Sua localização"
            pinColor={Tema.cores.secundaria}
          />
        ) : null}
        {comCoordenadas.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            title={item.titulo || TiposOcorrencia[item.tipo].label}
            description={`${TiposOcorrencia[item.tipo].label} · ${item.descricao}`}
            pinColor={TiposOcorrencia[item.tipo].cor}
            onCalloutPress={() => router.push(`/ocorrencia/${item.id}`)}
          />
        ))}
      </MapView>
      {comCoordenadas.length === 0 ? (
        <View style={estilos.aviso}>
          <Text style={estilos.avisoTexto}>
            Nenhuma ocorrência com coordenadas para exibir. Cadastre um registro com
            localização para vê-lo no mapa.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
  aviso: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: Tema.cores.superficie,
    borderRadius: Tema.raio.md,
    padding: Tema.espaco.md,
    borderWidth: 1,
    borderColor: Tema.cores.borda,
  },
  avisoTexto: {
    color: Tema.cores.textoSuave,
    fontSize: 13,
    textAlign: 'center',
  },
});
