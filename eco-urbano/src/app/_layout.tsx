import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { Tema } from '@/theme';

export default function LayoutRaiz() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Tema.cores.primaria },
            headerTintColor: Tema.cores.superficie,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: Tema.cores.fundo },
          }}
        >
          <Stack.Screen name="auth/login" options={{ title: 'Entrar' }} />
          <Stack.Screen name="auth/cadastro" options={{ title: 'Criar conta' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="qualidade-ar"
            options={{ title: 'Qualidade do ar' }}
          />
          <Stack.Screen name="clima" options={{ title: 'Condições meteorológicas' }} />
          <Stack.Screen
            name="ocorrencia/nova"
            options={{ title: 'Nova ocorrência' }}
          />
          <Stack.Screen
            name="ocorrencia/[id]"
            options={{ title: 'Detalhes da ocorrência' }}
          />
        </Stack>
      </AppProvider>
    </AuthProvider>
  );
}
