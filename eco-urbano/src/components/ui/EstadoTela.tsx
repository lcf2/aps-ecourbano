import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Tema } from '@/theme';
import { BotaoPrimario } from './BotaoPrimario';

type Icone = keyof typeof MaterialCommunityIcons.glyphMap;

interface PropsEstado {
  icone?: Icone;
  titulo: string;
  descricao: string;
  acaoRotulo?: string;
  onAcao?: () => void;
}

export function EstadoCarregamento({ mensagem }: { mensagem: string }) {
  return (
    <View style={estilos.caixa} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={Tema.cores.primaria} />
      <Text style={estilos.titulo}>{mensagem}</Text>
    </View>
  );
}

export function EstadoVazio({
  icone = 'inbox-outline',
  titulo,
  descricao,
  acaoRotulo,
  onAcao,
}: PropsEstado) {
  return (
    <View style={estilos.caixa}>
      <MaterialCommunityIcons
        name={icone}
        size={40}
        color={Tema.cores.secundariaMedia}
      />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.descricao}>{descricao}</Text>
      {acaoRotulo && onAcao ? (
        <BotaoPrimario rotulo={acaoRotulo} onPress={onAcao} />
      ) : null}
    </View>
  );
}

export function EstadoErro({
  titulo,
  descricao,
  acaoRotulo = 'Tentar novamente',
  onAcao,
}: PropsEstado) {
  return (
    <View style={estilos.caixa}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={40}
        color={Tema.cores.erro}
      />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.descricao}>{descricao}</Text>
      {onAcao ? <BotaoPrimario rotulo={acaoRotulo} onPress={onAcao} /> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    backgroundColor: Tema.cores.superficie,
    borderRadius: Tema.raio.md,
    padding: Tema.espaco.lg,
    alignItems: 'center',
    gap: Tema.espaco.sm,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: Tema.cores.texto,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 14,
    lineHeight: 20,
    color: Tema.cores.textoSuave,
    textAlign: 'center',
  },
});
