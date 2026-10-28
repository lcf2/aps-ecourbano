
import { StyleSheet, Text, View } from 'react-native';
import { Cartao } from '@/components/ui/Cartao';
import {
  EstadoCarregamento,
  EstadoVazio,
} from '@/components/ui/EstadoTela';
import { TelaBase } from '@/components/ui/TelaBase';
import { useApp } from '@/context/AppContext';
import { Tema } from '@/theme';
import { formatarCoordenadas, formatarDataHora } from '@/utils/formatacao';

export default function TelaQualidadeAr() {
  const { localidade, ambiente, ambienteCarregando, recarregarAmbiente } = useApp();
  const ar = ambiente.qualidadeAr;

  function formatarValor(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || !Number.isFinite(valor)) {
      return 'Indisponível';
    }

    return Number.isInteger(valor) ? String(valor) : valor.toFixed(1);
  }

  const indicadores = ar
    ? [
        { chave: 'IQA', valor: ar.iqa, unidade: 'índice' },
        { chave: 'PM2,5', valor: ar.pm25, unidade: 'µg/m³' },
        { chave: 'PM10', valor: ar.pm10, unidade: 'µg/m³' },
        { chave: 'CO', valor: ar.co, unidade: 'µg/m³' },
        { chave: 'NO₂', valor: ar.no2, unidade: 'µg/m³' },
        { chave: 'SO₂', valor: ar.so2, unidade: 'µg/m³' },
        { chave: 'O₃', valor: ar.o3, unidade: 'µg/m³' },
        { chave: 'Índice UV', valor: ar.uvIndex, unidade: '' },
        { chave: 'Poeira', valor: ar.poeira, unidade: 'µg/m³' },
      ]
    : [];

  return (
    <TelaBase>
      <Cartao>
        <Text style={estilos.secao}>Referência da consulta</Text>

        <Text style={estilos.texto}>
          Localidade: {formatarCoordenadas(localidade.latitude, localidade.longitude)}
        </Text>

        <Text style={estilos.texto}>
          Horário de atualização:{' '}
          {ar ? formatarDataHora(ar.horarioReferencia) : 'Indisponível'}
        </Text>

        <Text style={estilos.texto}>
          Origem dos dados: Open-Meteo / modelo atmosférico.
        </Text>

        <Text style={estilos.aviso}>
          {ar?.aviso ||
            ambiente.mensagem ||
            'Os valores de qualidade do ar são estimativas de modelos atmosféricos, não medições diretas de uma estação local.'}
        </Text>
      </Cartao>

      {ambienteCarregando ? (
        <EstadoCarregamento mensagem="Carregando indicadores..." />
      ) : ar ? (
        <>
          <Cartao>
            <Text style={estilos.secao}>Qualidade do ar</Text>

            <Text style={[estilos.categoria, { color: ar.cor }]}>
              {ar.categoria}
            </Text>

            <Text style={estilos.iqa}>
              IQA: {formatarValor(ar.iqa)}
            </Text>

            <Text style={estilos.texto}>
              Índice de qualidade do ar calculado pelo padrão US AQI.
            </Text>
          </Cartao>

          <Cartao>
            <Text style={estilos.secao}>Todos os indicadores</Text>

            {indicadores.map((item) => (
              <View key={item.chave} style={estilos.linha}>
                <Text style={estilos.nome}>{item.chave}</Text>

                <Text style={estilos.valor}>
                  {formatarValor(item.valor)}
                  {item.unidade ? ` ${item.unidade}` : ''}
                </Text>
              </View>
            ))}
          </Cartao>
        </>
      ) : (
        <EstadoVazio
          icone="blur"
          titulo="Indicadores indisponíveis"
          descricao={ambiente.mensagem}
          acaoRotulo="Tentar novamente"
          onAcao={() => void recarregarAmbiente()}
        />
      )}
    </TelaBase>
  );
}

const estilos = StyleSheet.create({
  secao: {
    fontSize: 13,
    fontWeight: '700',
    color: Tema.cores.textoMudo,
    textTransform: 'uppercase',
    marginBottom: Tema.espaco.sm,
  },
  texto: {
    fontSize: 14,
    color: Tema.cores.textoSuave,
    marginBottom: 6,
  },
  aviso: {
    marginTop: Tema.espaco.sm,
    fontSize: 13,
    lineHeight: 18,
    color: Tema.cores.aviso,
  },
  categoria: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  iqa: {
    fontSize: 30,
    fontWeight: '800',
    color: Tema.cores.texto,
    marginBottom: 8,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Tema.cores.borda,
  },
  nome: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Tema.cores.texto,
  },
  valor: {
    fontSize: 14,
    color: Tema.cores.secundaria,
    fontWeight: '700',
    textAlign: 'right',
  },
});
