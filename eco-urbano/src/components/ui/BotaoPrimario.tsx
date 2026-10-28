import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import { Tema } from '@/theme';

interface Props {
  rotulo: string;
  onPress: () => void;
  desabilitado?: boolean;
  carregando?: boolean;
  variante?: 'primario' | 'secundario' | 'contorno';
  estilo?: ViewStyle;
}

export function BotaoPrimario({
  rotulo,
  onPress,
  desabilitado = false,
  carregando = false,
  variante = 'primario',
  estilo,
}: Props) {
  const fundo =
    variante === 'primario'
      ? Tema.cores.primaria
      : variante === 'secundario'
        ? Tema.cores.secundaria
        : 'transparent';
  const corTexto =
    variante === 'contorno' ? Tema.cores.primaria : Tema.cores.superficie;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      disabled={desabilitado || carregando}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        { backgroundColor: fundo, opacity: pressed || desabilitado ? 0.7 : 1 },
        variante === 'contorno' && estilos.contorno,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[estilos.texto, { color: corTexto }]}>{rotulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Tema.raio.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Tema.espaco.lg,
  },
  contorno: {
    borderWidth: 1.5,
    borderColor: Tema.cores.primaria,
  },
  texto: {
    fontSize: 16,
    fontWeight: '700',
  },
});
