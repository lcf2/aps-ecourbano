
import type { DadosClima, DadosQualidadeAr } from '@/types/clima';

export const MENSAGEM_API_AMBIENTE_INDISPONIVEL =
  'Não foi possível obter os dados ambientais. Verifique sua conexão e tente novamente.';

export interface ResultadoAmbiente {
  clima: DadosClima | null;
  qualidadeAr: DadosQualidadeAr | null;
  mensagem: string;
}

type DadosApi = {
  current?: Record<string, unknown>;
  elevation?: number;
  timezone?: string;
};

function numero(
  dados: Record<string, unknown>,
  campo: string
): number {
  const valor = dados[campo];

  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    throw new Error(`A API não retornou o campo ${campo}.`);
  }

  return valor;
}

function texto(
  dados: Record<string, unknown>,
  campo: string,
  alternativa = ''
): string {
  const valor = dados[campo];
  return typeof valor === 'string' ? valor : alternativa;
}

function interpretarClima(codigo: number) {
  const codigos: Record<number, { descricao: string; icone: string }> = {
    0: { descricao: 'Céu limpo', icone: 'sunny' },
    1: { descricao: 'Predominantemente limpo', icone: 'partly-cloudy' },
    2: { descricao: 'Parcialmente nublado', icone: 'partly-cloudy' },
    3: { descricao: 'Nublado', icone: 'cloudy' },
    45: { descricao: 'Neblina', icone: 'fog' },
    48: { descricao: 'Neblina com geada', icone: 'fog' },
    51: { descricao: 'Garoa leve', icone: 'rainy' },
    53: { descricao: 'Garoa moderada', icone: 'rainy' },
    55: { descricao: 'Garoa intensa', icone: 'rainy' },
    61: { descricao: 'Chuva leve', icone: 'rainy' },
    63: { descricao: 'Chuva moderada', icone: 'rainy' },
    65: { descricao: 'Chuva forte', icone: 'rainy' },
    71: { descricao: 'Neve leve', icone: 'snowy' },
    73: { descricao: 'Neve moderada', icone: 'snowy' },
    75: { descricao: 'Neve forte', icone: 'snowy' },
    80: { descricao: 'Pancadas de chuva leves', icone: 'rainy' },
    81: { descricao: 'Pancadas de chuva moderadas', icone: 'rainy' },
    82: { descricao: 'Pancadas de chuva fortes', icone: 'rainy' },
    95: { descricao: 'Trovoada', icone: 'stormy' },
    96: { descricao: 'Trovoada com granizo', icone: 'stormy' },
    99: { descricao: 'Trovoada forte com granizo', icone: 'stormy' },
  };

  return codigos[codigo] ?? {
    descricao: 'Condição desconhecida',
    icone: 'cloudy',
  };
}

async function consultarApi(url: string): Promise<DadosApi> {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`Erro na API ambiental: ${resposta.status}`);
  }

  return (await resposta.json()) as DadosApi;
}

async function obterClima(
  latitude: number,
  longitude: number
): Promise<DadosClima> {
  const parametros = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
    ].join(','),
    wind_speed_unit: 'kmh',
    timezone: 'auto',
  });

  const resposta = await consultarApi(
    `https://api.open-meteo.com/v1/forecast?${parametros.toString()}`
  );

  if (!resposta.current) {
    throw new Error('A API meteorológica não retornou dados atuais.');
  }

  const atual = resposta.current;
  const codigoClima = numero(atual, 'weather_code');
  const interpretacao = interpretarClima(codigoClima);

  return {
    temperatura: numero(atual, 'temperature_2m'),
    sensacaoTermica: numero(atual, 'apparent_temperature'),
    umidade: numero(atual, 'relative_humidity_2m'),
    velocidadeVento: numero(atual, 'wind_speed_10m'),
    precipitacao: numero(atual, 'precipitation'),
    pressao: numero(atual, 'pressure_msl'),
    codigoClima,
    descricao: interpretacao.descricao,
    icone: interpretacao.icone,
    coberturaNuvens: numero(atual, 'cloud_cover'),
    isDia: numero(atual, 'is_day') === 1,
    horarioReferencia: texto(atual, 'time', new Date().toISOString()),
    elevacao:
      typeof resposta.elevation === 'number' ? resposta.elevation : 0,
    timezone: texto(resposta as Record<string, unknown>, 'timezone', 'auto'),
  };
}

function categoriaIqa(iqa: number) {
  if (iqa <= 50) {
    return { categoria: 'Boa', cor: '#4CAF50' };
  }
  if (iqa <= 100) {
    return { categoria: 'Moderada', cor: '#FFC107' };
  }
  if (iqa <= 150) {
    return { categoria: 'Insalubre para grupos sensíveis', cor: '#FF9800' };
  }
  if (iqa <= 200) {
    return { categoria: 'Insalubre', cor: '#F44336' };
  }
  if (iqa <= 300) {
    return { categoria: 'Muito insalubre', cor: '#9C27B0' };
  }
  return { categoria: 'Perigosa', cor: '#7E0023' };
}

async function obterQualidadeAr(
  latitude: number,
  longitude: number
): Promise<DadosQualidadeAr> {
  const parametros = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'us_aqi',
      'pm2_5',
      'pm10',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
      'uv_index',
      'dust',
    ].join(','),
    timezone: 'auto',
  });

  const resposta = await consultarApi(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${parametros.toString()}`
  );

  if (!resposta.current) {
    throw new Error('A API de qualidade do ar não retornou dados atuais.');
  }

  const atual = resposta.current;
  const iqa = numero(atual, 'us_aqi');
  const categoria = categoriaIqa(iqa);

  const pm25 = numero(atual, 'pm2_5');
  const pm10 = numero(atual, 'pm10');
  const co = numero(atual, 'carbon_monoxide');
  const no2 = numero(atual, 'nitrogen_dioxide');
  const so2 = numero(atual, 'sulphur_dioxide');
  const o3 = numero(atual, 'ozone');
  const uvIndex = numero(atual, 'uv_index');
  const poeira = numero(atual, 'dust');

  return {
    iqa,
    categoria: categoria.categoria,
    cor: categoria.cor,
    pm25,
    pm10,
    poluentes: [
      {
        nome: 'PM2.5',
        valor: pm25,
        unidade: 'µg/m³',
        descricao: 'Partículas finas',
      },
      {
        nome: 'PM10',
        valor: pm10,
        unidade: 'µg/m³',
        descricao: 'Material particulado',
      },
      {
        nome: 'CO',
        valor: co,
        unidade: 'µg/m³',
        descricao: 'Monóxido de carbono',
      },
      {
        nome: 'NO₂',
        valor: no2,
        unidade: 'µg/m³',
        descricao: 'Dióxido de nitrogênio',
      },
      {
        nome: 'SO₂',
        valor: so2,
        unidade: 'µg/m³',
        descricao: 'Dióxido de enxofre',
      },
      {
        nome: 'O₃',
        valor: o3,
        unidade: 'µg/m³',
        descricao: 'Ozônio',
      },
    ],
    co,
    no2,
    so2,
    o3,
    uvIndex,
    poeira,
    horarioReferencia: texto(atual, 'time', new Date().toISOString()),
    timezone: texto(resposta as Record<string, unknown>, 'timezone', 'auto'),
    aviso:
      'Dados estimados por modelos atmosféricos. Não representam uma medição direta de uma estação local.',
  };
}

export async function obterDadosAmbientais(
  latitude: number | null,
  longitude: number | null
): Promise<ResultadoAmbiente> {
  if (
    latitude === null ||
    longitude === null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return {
      clima: null,
      qualidadeAr: null,
      mensagem: 'Localização indisponível. Ative a localização para consultar os dados ambientais.',
    };
  }

  const [resultadoClima, resultadoAr] = await Promise.allSettled([
    obterClima(latitude, longitude),
    obterQualidadeAr(latitude, longitude),
  ]);

  const clima =
    resultadoClima.status === 'fulfilled' ? resultadoClima.value : null;

  const qualidadeAr =
    resultadoAr.status === 'fulfilled' ? resultadoAr.value : null;

  let mensagem = '';

  if (!clima && !qualidadeAr) {
    mensagem =
      'Não foi possível consultar as APIs ambientais. Verifique a conexão e tente novamente.';
  } else if (!clima) {
    mensagem = 'Os dados meteorológicos estão temporariamente indisponíveis.';
  } else if (!qualidadeAr) {
    mensagem = 'Os dados de qualidade do ar estão temporariamente indisponíveis.';
  }

  return { clima, qualidadeAr, mensagem };
}
