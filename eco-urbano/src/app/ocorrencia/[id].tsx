import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { TiposOcorrencia } from '@/constants/tiposOcorrencia';
import { BotaoPrimario } from '@/components/ui/BotaoPrimario';
import { Cartao } from '@/components/ui/Cartao';
import { EstadoVazio } from '@/components/ui/EstadoTela';
import { TelaBase } from '@/components/ui/TelaBase';
import { useApp } from '@/context/AppContext';
import { Tema } from '@/theme';
import { formatarCoordenadas, formatarDataHora } from '@/utils/formatacao';

export default function TelaDetalheOcorrencia() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ocorrencias } = useApp();
  const ocorrencia = ocorrencias.find((item) => item.id === id);

  if (!ocorrencia) {
    return (
      <TelaBase>
        <EstadoVazio
          icone="file-search-outline"
          titulo="Ocorrência não encontrada"
          descricao="Este registro não está salvo neste aparelho."
          acaoRotulo="Voltar à lista"
          onAcao={() => router.replace('/ocorrencias')}
        />
      </TelaBase>
    );
  }

  const tipo = TiposOcorrencia[ocorrencia.tipo];

  return (
    <TelaBase>
      <Cartao>
        <View style={estilos.cabecalho}>
          <View style={[estilos.icone, { backgroundColor: `${tipo.cor}22` }]}>
            <MaterialCommunityIcons
              name={tipo.icone as keyof typeof MaterialCommunityIcons.glyphMap}
              size={28}
              color={tipo.cor}
            />
          </View>
          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.tipo}>{tipo.label}</Text>
            <Text style={estilos.status}>
              Status: {ocorrencia.status === 'ativo' ? 'Ativo' : 'Resolvido'}
            </Text>
          </View>
        </View>
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Título</Text>
        <Text style={estilos.corpo}>{ocorrencia.titulo || 'Ocorrência sem título'}</Text>
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Descrição</Text>
        <Text style={estilos.corpo}>{ocorrencia.descricao}</Text>
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Localização</Text>
        <Linha rotulo="Endereço" valor={ocorrencia.endereco} />
        <Linha
          rotulo="Coordenadas"
          valor={formatarCoordenadas(ocorrencia.latitude, ocorrencia.longitude)}
        />
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Registro</Text>
        <Linha rotulo="Identificador" valor={ocorrencia.id} />
        <Linha rotulo="Data da ocorrência" valor={formatarDataHora(ocorrencia.criadoEm)} />
        <Text style={estilos.nota}>
          Os dados são salvos localmente e, quando configurado, também no Supabase com RLS ativo.
        </Text>
      </Cartao>

      <BotaoPrimario
        rotulo="Ver no mapa"
        variante="secundario"
        onPress={() => router.push('/mapa')}
      />
    </TelaBase>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    gap: Tema.espaco.md,
    alignItems: 'center',
  },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabecalhoTexto: {
    flex: 1,
  },
  tipo: {
    fontSize: 22,
    fontWeight: '800',
    color: Tema.cores.texto,
  },
  status: {
    marginTop: 4,
    color: Tema.cores.textoSuave,
  },
  secao: {
    fontSize: 13,
    fontWeight: '700',
    color: Tema.cores.textoMudo,
    textTransform: 'uppercase',
    marginBottom: Tema.espaco.sm,
  },
  corpo: {
    fontSize: 16,
    lineHeight: 24,
    color: Tema.cores.texto,
  },
  linha: {
    marginBottom: Tema.espaco.sm,
  },
  rotulo: {
    fontSize: 12,
    color: Tema.cores.textoMudo,
  },
  valor: {
    fontSize: 16,
    color: Tema.cores.texto,
  },
  nota: {
    marginTop: Tema.espaco.sm,
    fontSize: 13,
    color: Tema.cores.textoSuave,
  },
});
