import { StyleSheet, View, type ViewProps } from 'react-native';
import { Tema } from '@/theme';

export function Cartao({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[estilos.cartao, style]} {...rest}>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: Tema.cores.superficie,
    borderRadius: Tema.raio.md,
    padding: Tema.espaco.md,
    borderWidth: 1,
    borderColor: Tema.cores.borda,
  },
});
