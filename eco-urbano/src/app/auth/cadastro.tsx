import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BotaoPrimario } from '@/components/ui/BotaoPrimario';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { TelaBase } from '@/components/ui/TelaBase';
import { useAuth } from '@/context/AuthContext';
import { Tema } from '@/theme';

export default function CadastroScreen() {
  const router = useRouter();
  const { signUp, isConfigured } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, e-mail e senha.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await signUp(email.trim(), senha, nome.trim());
      router.replace('/(tabs)');
    } catch (erro) {
      Alert.alert(
        'Não foi possível criar a conta',
        erro instanceof Error ? erro.message : 'Tente novamente em alguns instantes.'
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
            Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY antes de criar uma conta.
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
      <Text style={estilos.titulo}>Criar conta</Text>
      <Text style={estilos.subtitulo}>
        Cadastre-se para salvar ocorrências e manter o histórico no Supabase.
      </Text>

      <CampoTexto
        rotulo="Nome completo"
        valor={nome}
        onChangeTexto={setNome}
        placeholder="Seu nome"
      />

      <CampoTexto
        rotulo="E-mail"
        valor={email}
        onChangeTexto={setEmail}
        placeholder="seu@email.com"
      />

      <CampoTexto
        rotulo="Senha"
        valor={senha}
        onChangeTexto={setSenha}
        placeholder="Mínimo 6 caracteres"
        seguro
      />

      <BotaoPrimario
        rotulo="Cadastrar"
        carregando={carregando}
        onPress={() => void enviar()}
      />

      <View style={estilos.rodape}>
        <Text style={estilos.texto}>Já tem conta?</Text>
        <Link href="/auth/login" asChild>
          <Text style={estilos.link}>Entrar</Text>
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
