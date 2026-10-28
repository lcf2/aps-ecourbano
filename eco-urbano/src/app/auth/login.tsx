import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BotaoPrimario } from '@/components/ui/BotaoPrimario';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { TelaBase } from '@/components/ui/TelaBase';
import { useAuth } from '@/context/AuthContext';
import { Tema } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe e-mail e senha para continuar.');
      return;
    }

    setCarregando(true);
    try {
      await signIn(email.trim(), senha);
      router.replace('/(tabs)');
    } catch (erro) {
      Alert.alert(
        'Não foi possível entrar',
        erro instanceof Error ? erro.message : 'Verifique as credenciais e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  if (!isConfigured) {
    return (
      <TelaBase>
        <View style={estilos.caixaAviso}>
          <Text style={estilos.titulo}>Supabase não configurado</Text>
          <Text style={estilos.texto}>
            Crie um arquivo .env com EXPO_PUBLIC_SUPABASE_URL e
            EXPO_PUBLIC_SUPABASE_ANON_KEY para ativar a autenticação.
          </Text>
          <Link href="/" asChild>
            <BotaoPrimario rotulo="Voltar ao início" onPress={() => undefined} />
          </Link>
        </View>
      </TelaBase>
    );
  }

  return (
    <TelaBase>
      <Text style={estilos.titulo}>Entrar</Text>
      <Text style={estilos.subtitulo}>
        Acesse sua conta para sincronizar ocorrências no Supabase.
      </Text>

      <CampoTexto
        rotulo="E-mail"
        valor={email}
        onChangeTexto={setEmail}
        placeholder="seu@email.com"
        teclado="default"
      />

      <CampoTexto
        rotulo="Senha"
        valor={senha}
        onChangeTexto={setSenha}
        placeholder="Sua senha"
        seguro
      />

      <BotaoPrimario
        rotulo="Entrar"
        carregando={carregando}
        onPress={() => void enviar()}
      />

      <View style={estilos.rodape}>
        <Text style={estilos.texto}>Ainda não tem conta?</Text>
        <Link href="/auth/cadastro" asChild>
          <Text style={estilos.link}>Criar conta</Text>
        </Link>
      </View>
    </TelaBase>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: Tema.cores.primaria,
  },
  subtitulo: {
    fontSize: 15,
    lineHeight: 22,
    color: Tema.cores.textoSuave,
  },
  caixaAviso: {
    gap: Tema.espaco.md,
  },
  texto: {
    fontSize: 14,
    color: Tema.cores.textoSuave,
    lineHeight: 20,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tema.espaco.sm,
  },
  link: {
    color: Tema.cores.secundaria,
    fontWeight: '700',
  },
});
