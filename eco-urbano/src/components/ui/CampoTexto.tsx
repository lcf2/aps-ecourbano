import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Tema } from '@/theme';

interface Props {
  rotulo: string;
  valor: string;
  onChangeTexto: (texto: string) => void;
  placeholder?: string;
  erro?: string;
  multilinha?: boolean;
  teclado?: 'default' | 'numeric' | 'decimal-pad';
  seguro?: boolean;
}

export function CampoTexto({
  rotulo,
  valor,
  onChangeTexto,
  placeholder,
  erro,
  multilinha = false,
  teclado = 'default',
  seguro = false,
}: Props) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        value={valor}
        onChangeText={onChangeTexto}
        placeholder={placeholder}
        placeholderTextColor={Tema.cores.textoMudo}
        multiline={multilinha}
        keyboardType={teclado}
        textAlignVertical={multilinha ? 'top' : 'center'}
        secureTextEntry={seguro}
        autoCapitalize={seguro ? 'none' : 'sentences'}
        style={[
          estilos.campo,
          multilinha && estilos.multilinha,
          erro ? estilos.campoErro : null,
        ]}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    gap: Tema.espaco.xs,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: Tema.cores.textoSuave,
  },
  campo: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Tema.cores.borda,
    borderRadius: Tema.raio.sm,
    paddingHorizontal: Tema.espaco.md,
    backgroundColor: Tema.cores.superficie,
    color: Tema.cores.texto,
    fontSize: 16,
  },
  multilinha: {
    minHeight: 110,
    paddingTop: Tema.espaco.md,
  },
  campoErro: {
    borderColor: Tema.cores.erro,
  },
  erro: {
    color: Tema.cores.erro,
    fontSize: 13,
  },
});
