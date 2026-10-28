import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SeletorTipo } from '@/components/ocorrencias/SeletorTipo';
import { BotaoPrimario } from '@/components/ui/BotaoPrimario';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { TelaBase } from '@/components/ui/TelaBase';
import { useApp } from '@/context/AppContext';
import { Tema } from '@/theme';
import type { TipoOcorrencia } from '@/types/ocorrencia';
import { validarLatitude, validarLongitude } from '@/utils/formatacao';

interface ErrosFormulario {
  titulo?: string;
  tipo?: string;
  descricao?: string;
  endereco?: string;
  data?: string;
  coordenadas?: string;
}

export default function TelaNovaOcorrencia() {
  const router = useRouter();
  const { localidade, recarregarLocalidade, localidadeCarregando, registrarOcorrencia } =
    useApp();

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoOcorrencia | undefined>();
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataOcorrencia, setDataOcorrencia] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [latitude, setLatitude] = useState(
    localidade.latitude !== null ? String(localidade.latitude) : ''
  );
  const [longitude, setLongitude] = useState(
    localidade.longitude !== null ? String(localidade.longitude) : ''
  );
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!latitude && localidade.latitude !== null && localidade.longitude !== null) {
      setLatitude(String(localidade.latitude));
      setLongitude(String(localidade.longitude));
    }
  }, [latitude, localidade.latitude, localidade.longitude]);

  function preencherGps() {
    if (localidade.latitude !== null && localidade.longitude !== null) {
      setLatitude(String(localidade.latitude));
      setLongitude(String(localidade.longitude));
      return;
    }
    void recarregarLocalidade().then(() => {
      Alert.alert(
        'Localização',
        'Se a permissão for concedida, toque novamente em Usar localização atual.'
      );
    });
  }

  function validar(): boolean {
    const proximos: ErrosFormulario = {};
    if (!titulo.trim()) {
      proximos.titulo = 'Informe um título para a ocorrência.';
    }
    if (!tipo) {
      proximos.tipo = 'Escolha uma categoria.';
    }
    if (descricao.trim().length < 10) {
      proximos.descricao = 'Descreva o que ocorreu com pelo menos 10 caracteres.';
    }
    if (endereco.trim().length < 5) {
      proximos.endereco = 'Informe um endereço ou ponto de referência.';
    }

    const dataValida = !Number.isNaN(new Date(dataOcorrencia).getTime());
    if (!dataValida) {
      proximos.data = 'Informe uma data válida.';
    }

    const lat = Number(latitude.replace(',', '.'));
    const lng = Number(longitude.replace(',', '.'));
    if (!validarLatitude(lat) || !validarLongitude(lng)) {
      proximos.coordenadas =
        'Informe latitude e longitude válidas, ou use a localização atual.';
    }

    setErros(proximos);
    return Object.keys(proximos).length === 0;
  }

  async function enviar() {
    if (!validar() || !tipo) {
      return;
    }

    setEnviando(true);
    try {
      await registrarOcorrencia({
        id: `${Date.now()}`,
        titulo: titulo.trim(),
        tipo,
        descricao: descricao.trim(),
        endereco: endereco.trim(),
        latitude: Number(latitude.replace(',', '.')),
        longitude: Number(longitude.replace(',', '.')),
        criadoEm: new Date(dataOcorrencia),
        status: 'ativo',
      });
      router.replace('/ocorrencias');
    } catch {
      Alert.alert(
        'Não foi possível salvar',
        'Verifique o armazenamento deste aparelho e tente de novo.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <TelaBase>
      <Text style={estilos.intro}>
        Os registros ficam neste aparelho. Não envie dados pessoais desnecessários.
      </Text>

      <CampoTexto
        rotulo="Título da ocorrência"
        valor={titulo}
        onChangeTexto={setTitulo}
        placeholder="Ex.: Buraco na rua principal"
        erro={erros.titulo}
      />

      <SeletorTipo valor={tipo} onChange={setTipo} erro={erros.tipo} />

      <CampoTexto
        rotulo="Descrição"
        valor={descricao}
        onChangeTexto={setDescricao}
        placeholder="O que foi observado no local?"
        multilinha
        erro={erros.descricao}
      />

      <CampoTexto
        rotulo="Data da ocorrência"
        valor={dataOcorrencia}
        onChangeTexto={setDataOcorrencia}
        placeholder="YYYY-MM-DD"
        erro={erros.data}
      />

      <CampoTexto
        rotulo="Endereço ou referência"
        valor={endereco}
        onChangeTexto={setEndereco}
        placeholder="Rua, bairro ou ponto conhecido"
        erro={erros.endereco}
      />

      <View style={estilos.coords}>
        <View style={estilos.coordCampo}>
          <CampoTexto
            rotulo="Latitude"
            valor={latitude}
            onChangeTexto={setLatitude}
            placeholder="Latitude (ex.: -15.7801)"
            teclado="decimal-pad"
          />
        </View>
        <View style={estilos.coordCampo}>
          <CampoTexto
            rotulo="Longitude"
            valor={longitude}
            onChangeTexto={setLongitude}
            placeholder="Longitude (ex.: -47.9292)"
            teclado="decimal-pad"
          />
        </View>
      </View>
      {erros.coordenadas ? (
        <Text style={estilos.erro}>{erros.coordenadas}</Text>
      ) : null}

      <BotaoPrimario
        rotulo="Usar localização atual"
        variante="contorno"
        carregando={localidadeCarregando}
        onPress={preencherGps}
      />
      <BotaoPrimario
        rotulo="Salvar ocorrência"
        carregando={enviando}
        onPress={() => void enviar()}
      />
    </TelaBase>
  );
}

const estilos = StyleSheet.create({
  intro: {
    fontSize: 14,
    lineHeight: 20,
    color: Tema.cores.textoSuave,
  },
  coords: {
    flexDirection: 'row',
    gap: Tema.espaco.sm,
  },
  coordCampo: {
    flex: 1,
  },
  erro: {
    color: Tema.cores.erro,
    fontSize: 13,
  },
});
