
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

const CAMPOS = [
  { rotulo: 'Temperatura', unidade: '°C', chave: 'temperatura' },
  { rotulo: 'Sensação térmica', unidade: '°C', chave: 'sensacaoTermica' },
  { rotulo: 'Umidade', unidade: '%', chave: 'umidade' },
  { rotulo: 'Vento', unidade: 'km/h', chave: 'velocidadeVento' },
  { rotulo: 'Precipitação', unidade: 'mm', chave: 'precipitacao' },
  { rotulo: 'Pressão', unidade: 'hPa', chave: 'pressao' },
  { rotulo: 'Cobertura de nuvens', unidade: '%', chave: 'coberturaNuvens' },
] as const;

export default function TelaClima() {
  const { localidade, ambiente, ambienteCarregando, recarregarAmbiente } = useApp();
  const clima = ambiente.clima;

  function formatarValor(valor: number) {
    return Number.isInteger(valor) ? String(valor) : valor.toFixed(1);
  }

  return (
    <TelaBase>
      <Cartao>
        <Text style={estilos.secao}>Referência da consulta</Text>

        <Text style={estilos.texto}>
          Localidade: {formatarCoordenadas(localidade.latitude, localidade.longitude)}
        </Text>

        <Text style={estilos.texto}>
          Horário de atualização:{' '}
          {clima
            ? formatarDataHora(clima.horarioReferencia)
            : 'Indisponível'}
        </Text>

        <Text style={estilos.texto}>
          Origem dos dados: Open-Meteo / modelo meteorológico regional.
        </Text>

        <Text style={estilos.aviso}>
          {ambiente.mensagem ||
            'Dados meteorológicos estimados por modelo, não por medição de estação local.'}
        </Text>
      </Cartao>

      {ambienteCarregando ? (
        <EstadoCarregamento mensagem="Carregando meteorologia..." />
      ) : clima ? (
        <Cartao>
          <Text style={estilos.destaque}>{clima.descricao}</Text>

          <Text style={estilos.temperatura}>
            {formatarValor(clima.temperatura)} °C
          </Text>

          <Text style={estilos.texto}>
            Sensação térmica: {formatarValor(clima.sensacaoTermica)} °C
          </Text>

          <Text style={estilos.texto}>
            Umidade: {formatarValor(clima.umidade)}%
          </Text>
        </Cartao>
      ) : (
        <EstadoVazio
          icone="weather-cloudy"
          titulo="Meteorologia indisponível"
          descricao={ambiente.mensagem}
          acaoRotulo="Tentar novamente"
          onAcao={() => void recarregarAmbiente()}
        />
      )}

      <Cartao>
        <Text style={estilos.secao}>Condições meteorológicas</Text>

        {CAMPOS.map((item) => {
          const valor = clima
            ? clima[item.chave]
            : null;

          return (
            <View key={item.rotulo} style={estilos.linha}>
              <Text style={estilos.nome}>{item.rotulo}</Text>
              <Text style={estilos.unidade}>
                {valor === null || valor === undefined
                  ? 'Indisponível'
                  : `${formatarValor(valor)} ${item.unidade}`}
              </Text>
            </View>
          );
        })}
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Outras informações</Text>

        <View style={estilos.linha}>
          <Text style={estilos.nome}>Condição do dia</Text>
          <Text style={estilos.unidade}>
            {clima ? (clima.isDia ? 'Dia' : 'Noite') : 'Indisponível'}
          </Text>
        </View>

        <View style={estilos.linha}>
          <Text style={estilos.nome}>Código meteorológico</Text>
          <Text style={estilos.unidade}>
            {clima ? clima.codigoClima : 'Indisponível'}
          </Text>
        </View>
      </Cartao>
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
  destaque: {
    fontSize: 20,
    fontWeight: '800',
    color: Tema.cores.texto,
    marginBottom: 8,
  },
  temperatura: {
    fontSize: 32,
    fontWeight: '800',
    color: Tema.cores.texto,
    marginBottom: 8,
  },
  aviso: {
    marginTop: Tema.espaco.sm,
    fontSize: 13,
    lineHeight: 18,
    color: Tema.cores.aviso,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Tema.cores.borda,
  },
  nome: {
    flex: 1,
    fontSize: 15,
    color: Tema.cores.texto,
  },
  unidade: {
    flexShrink: 1,
    fontSize: 14,
    color: Tema.cores.textoMudo,
    textAlign: 'right',
  },
});
