import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TiposOcorrencia } from '@/constants/tiposOcorrencia';
import { Tema } from '@/theme';
import type { Ocorrencia } from '@/types/ocorrencia';
import { formatarDataHora } from '@/utils/formatacao';

interface Props {
  ocorrencia: Ocorrencia;
  onPress: () => void;
}

export function CartaoOcorrencia({ ocorrencia, onPress }: Props) {
  const tipo = TiposOcorrencia[ocorrencia.tipo];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${tipo.label}. ${ocorrencia.descricao}`}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
    >
      <View style={[estilos.icone, { backgroundColor: `${tipo.cor}22` }]}>
        <MaterialCommunityIcons
          name={tipo.icone as keyof typeof MaterialCommunityIcons.glyphMap}
          size={22}
          color={tipo.cor}
        />
      </View>
      <View style={estilos.texto}>
        <Text style={estilos.titulo}>{ocorrencia.titulo || tipo.label}</Text>
        <Text style={estilos.categoria}>{tipo.label}</Text>
        <Text style={estilos.descricao} numberOfLines={2}>
          {ocorrencia.descricao}
        </Text>
        <Text style={estilos.meta}>
          {ocorrencia.endereco} · {formatarDataHora(ocorrencia.criadoEm)}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    gap: Tema.espaco.md,
    backgroundColor: Tema.cores.superficie,
    borderRadius: Tema.raio.md,
    padding: Tema.espaco.md,
    borderWidth: 1,
    borderColor: Tema.cores.borda,
  },
  pressionado: {
    opacity: 0.75,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: Tema.cores.texto,
  },
  categoria: {
    fontSize: 12,
    color: Tema.cores.secundaria,
    fontWeight: '600',
  },
  descricao: {
    fontSize: 14,
    color: Tema.cores.textoSuave,
  },
  meta: {
    fontSize: 12,
    color: Tema.cores.textoMudo,
  },
});
