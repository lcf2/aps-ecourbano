import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Tema } from '@/theme';

function corAba(color: string | number | object | null | undefined): string {
  return typeof color === 'string' ? color : Tema.cores.textoMudo;
}

export default function LayoutAbas() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Tema.cores.primaria },
        headerTintColor: Tema.cores.superficie,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: Tema.cores.primaria,
        tabBarInactiveTintColor: Tema.cores.textoMudo,
        tabBarStyle: {
          backgroundColor: Tema.cores.superficie,
          borderTopColor: Tema.cores.borda,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={corAba(color)}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map"
              color={corAba(color)}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ocorrencias"
        options={{
          title: 'Ocorrências',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="alert-decagram"
              color={corAba(color)}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
