import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Tema } from '@/theme';

interface Props {
  children: ReactNode;
  rolavel?: boolean;
}

export function TelaBase({ children, rolavel = true }: Props) {
  const conteudo = rolavel ? (
    <ScrollView
      contentContainerStyle={estilos.conteudo}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[estilos.conteudo, estilos.flex]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={estilos.fundo}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {conteudo}
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: Tema.cores.fundo,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    padding: Tema.espaco.md,
    gap: Tema.espaco.md,
    paddingBottom: Tema.espaco.xl,
  },
});
