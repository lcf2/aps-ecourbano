import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartaoOcorrencia } from '@/components/ocorrencias/CartaoOcorrencia';
import { BotaoPrimario } from '@/components/ui/BotaoPrimario';
import {
  EstadoCarregamento,
  EstadoErro,
  EstadoVazio,
} from '@/components/ui/EstadoTela';
import { TelaBase } from '@/components/ui/TelaBase';
import { useApp } from '@/context/AppContext';
import { TiposOcorrencia } from '@/constants/tiposOcorrencia';
import type { TipoOcorrencia } from '@/types/ocorrencia';
import { Tema } from '@/theme';

export default function TelaOcorrencias() {
  const router = useRouter();
  const {
    ocorrencias,
    ocorrenciasCarregando,
    ocorrenciasErro,
    recarregarOcorrencias,
  } = useApp();
  const [filtro, setFiltro] = useState<TipoOcorrencia | 'todos'>('todos');

  const listaFiltrada = useMemo(() => {
    if (filtro === 'todos') {
      return ocorrencias;
    }
    return ocorrencias.filter((item) => item.tipo === filtro);
  }, [filtro, ocorrencias]);

  return (
    <TelaBase>
      <BotaoPrimario
        rotulo="Nova ocorrência"
        onPress={() => router.push('/ocorrencia/nova')}
      />

      <View style={estilos.filtros}>
        <Text style={estilos.rotuloFiltro}>Filtrar por categoria</Text>
        <View style={estilos.filtrosLista}>
          <BotaoFiltro ativo={filtro === 'todos'} label="Todas" onPress={() => setFiltro('todos')} />
          {(Object.keys(TiposOcorrencia) as TipoOcorrencia[]).map((tipo) => (
            <BotaoFiltro
              key={tipo}
              ativo={filtro === tipo}
              label={TiposOcorrencia[tipo].label}
              onPress={() => setFiltro(tipo)}
            />
          ))}
        </View>
      </View>

      {ocorrenciasCarregando ? (
        <EstadoCarregamento mensagem="Carregando ocorrências..." />
      ) : ocorrenciasErro ? (
        <EstadoErro
          titulo="Falha ao carregar"
          descricao={ocorrenciasErro}
          onAcao={() => void recarregarOcorrencias()}
        />
      ) : listaFiltrada.length === 0 ? (
        <EstadoVazio
          icone="clipboard-text-off-outline"
          titulo="Nenhuma ocorrência"
          descricao={
            filtro === 'todos'
              ? 'Os registros cadastrados aparecerão aqui.'
              : 'Nenhuma ocorrência foi encontrada para esta categoria.'
          }
          acaoRotulo="Cadastrar agora"
          onAcao={() => router.push('/ocorrencia/nova')}
        />
      ) : (
        <View style={estilos.lista}>
          {listaFiltrada.map((item) => (
            <CartaoOcorrencia
              key={item.id}
              ocorrencia={item}
              onPress={() => router.push(`/ocorrencia/${item.id}`)}
            />
          ))}
        </View>
      )}
    </TelaBase>
  );
}

function BotaoFiltro({
  label,
  ativo,
  onPress,
}: {
  label: string;
  ativo: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[estilos.filtroBotao, ativo && estilos.filtroBotaoAtivo]}
    >
      <Text style={[estilos.filtroTexto, ativo && estilos.filtroTextoAtivo]}>{label}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  filtros: {
    gap: Tema.espaco.sm,
  },
  rotuloFiltro: {
    fontSize: 13,
    fontWeight: '700',
    color: Tema.cores.textoMudo,
    textTransform: 'uppercase',
  },
  filtrosLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Tema.espaco.sm,
  },
  filtroBotao: {
    borderWidth: 1,
    borderColor: Tema.cores.borda,
    borderRadius: Tema.raio.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Tema.cores.superficie,
  },
  filtroBotaoAtivo: {
    borderColor: Tema.cores.primaria,
    backgroundColor: `${Tema.cores.primaria}14`,
  },
  filtroTexto: {
    fontSize: 12,
    color: Tema.cores.textoSuave,
    fontWeight: '600',
  },
  filtroTextoAtivo: {
    color: Tema.cores.primaria,
  },
  lista: {
    gap: 12,
  },
});
