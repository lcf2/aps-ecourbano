import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Cartao } from '@/components/ui/Cartao';
import {
  EstadoCarregamento,
  EstadoErro,
  EstadoVazio,
} from '@/components/ui/EstadoTela';
import { TelaBase } from '@/components/ui/TelaBase';
import { BotaoPrimario } from '@/components/ui/BotaoPrimario';
import { useApp } from '@/context/AppContext';
import { Tema } from '@/theme';
import { formatarCoordenadas, formatarDataHora } from '@/utils/formatacao';

export default function TelaInicio() {
  const router = useRouter();
  const {
    localidade,
    localidadeCarregando,
    localidadeErro,
    recarregarLocalidade,
    ambiente,
    ambienteCarregando,
    recarregarAmbiente,
    ocorrencias,
  } = useApp();

  return (
    <TelaBase>
      <View>
        <Text style={estilos.saudacao}>EcoUrbano</Text>
        <Text style={estilos.subtitulo}>
          Consulte o ambiente urbano e registre ocorrências da sua região.
        </Text>
      </View>

      <Cartao>
        <Text style={estilos.secao}>Localidade selecionada</Text>
        {localidadeCarregando ? (
          <EstadoCarregamento mensagem="Obtendo localização..." />
        ) : localidadeErro ? (
          <EstadoErro
            titulo="Localização indisponível"
            descricao={localidadeErro}
            onAcao={() => void recarregarLocalidade()}
          />
        ) : (
          <>
            <Text style={estilos.destaque}>{localidade.rotulo}</Text>
            <Text style={estilos.meta}>
              {formatarCoordenadas(localidade.latitude, localidade.longitude)}
            </Text>
            <BotaoPrimario
              rotulo="Atualizar localização"
              variante="contorno"
              onPress={() => void recarregarLocalidade()}
            />
          </>
        )}
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Resumo ambiental</Text>
        {ambienteCarregando ? (
          <EstadoCarregamento mensagem="Consultando dados ambientais..." />
        ) : ambiente.qualidadeAr || ambiente.clima ? (
          <>
            <Text style={estilos.resumoTitulo}>
              {ambiente.qualidadeAr
                ? `Qualidade do ar: ${ambiente.qualidadeAr.categoria} (IQA ${ambiente.qualidadeAr.iqa})`
                : `Clima: ${ambiente.clima?.descricao ?? 'Sem dados'}`}
            </Text>
            {ambiente.qualidadeAr ? (
              <Text style={estilos.meta}>
                PM2.5 {ambiente.qualidadeAr.pm25} μg/m³ · Atualizado em{' '}
                {formatarDataHora(ambiente.qualidadeAr.horarioReferencia)}
              </Text>
            ) : ambiente.clima ? (
              <Text style={estilos.meta}>
                {ambiente.clima.temperatura} °C · Umidade {ambiente.clima.umidade}% ·{' '}
                {formatarDataHora(ambiente.clima.horarioReferencia)}
              </Text>
            ) : null}
            <Text style={estilos.aviso}>{ambiente.mensagem}</Text>
          </>
        ) : (
          <EstadoVazio
            icone="cloud-question"
            titulo="Sem dados ambientais"
            descricao={ambiente.mensagem}
            acaoRotulo="Verificar novamente"
            onAcao={() => void recarregarAmbiente()}
          />
        )}
        <View style={estilos.atalhos}>
          <Atalho
            href="/qualidade-ar"
            icone="blur"
            rotulo="Qualidade do ar"
            cor={Tema.cores.secundaria}
          />
          <Atalho
            href="/clima"
            icone="weather-partly-cloudy"
            rotulo="Meteorologia"
            cor={Tema.cores.primaria}
          />
        </View>
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Ocorrências neste aparelho</Text>
        <Text style={estilos.meta}>
          {ocorrencias.length === 0
            ? 'Nenhuma ocorrência cadastrada ainda.'
            : `${ocorrencias.length} registro(s) salvo(s) localmente.`}
        </Text>
        <BotaoPrimario
          rotulo="Registrar ocorrência"
          onPress={() => router.push('/ocorrencia/nova')}
        />
      </Cartao>
    </TelaBase>
  );
}

function Atalho({
  href,
  icone,
  rotulo,
  cor,
}: {
  href: '/qualidade-ar' | '/clima';
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
  rotulo: string;
  cor: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={estilos.atalho} accessibilityRole="link">
        <MaterialCommunityIcons name={icone} size={22} color={cor} />
        <Text style={estilos.atalhoTexto}>{rotulo}</Text>
      </Pressable>
    </Link>
  );
}

const estilos = StyleSheet.create({
  saudacao: {
    fontSize: 28,
    fontWeight: '800',
    color: Tema.cores.primaria,
  },
  subtitulo: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
    color: Tema.cores.textoSuave,
  },
  secao: {
    fontSize: 13,
    fontWeight: '700',
    color: Tema.cores.textoMudo,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: Tema.espaco.sm,
  },
  destaque: {
    fontSize: 18,
    fontWeight: '700',
    color: Tema.cores.texto,
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: Tema.cores.textoSuave,
    marginBottom: Tema.espaco.md,
  },
  resumoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: Tema.cores.texto,
    marginBottom: Tema.espaco.sm,
  },
  aviso: {
    fontSize: 12,
    lineHeight: 18,
    color: Tema.cores.aviso,
    marginBottom: Tema.espaco.md,
  },
  atalhos: {
    flexDirection: 'row',
    gap: Tema.espaco.sm,
    marginTop: Tema.espaco.md,
  },
  atalho: {
    flex: 1,
    minHeight: 72,
    borderRadius: Tema.raio.md,
    borderWidth: 1,
    borderColor: Tema.cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Tema.cores.fundo,
  },
  atalhoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: Tema.cores.texto,
    textAlign: 'center',
  },
});
