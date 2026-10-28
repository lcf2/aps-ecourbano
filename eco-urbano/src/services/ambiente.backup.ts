import type { DadosClima, DadosQualidadeAr } from '@/types/clima';

export const MENSAGEM_API_AMBIENTE_INDISPONIVEL =
  'Os dados ambientais ainda não estão conectados a um serviço real. Neste protótipo, a aplicação usa dados de demonstração claramente identificados para manter a interface funcional.';

export interface ResultadoAmbiente {
  clima: DadosClima | null;
  qualidadeAr: DadosQualidadeAr | null;
  mensagem: string;
}

function criarDadosDemonstracao(): ResultadoAmbiente {
  const horarioReferencia = new Date().toISOString();

  return {
    clima: {
      temperatura: 26.4,
      sensacaoTermica: 28.1,
      umidade: 68,
      velocidadeVento: 12.4,
      precipitacao: 0.4,
      pressao: 1014,
      codigoClima: 2,
      descricao: 'Parcialmente nublado',
      icone: 'partly-cloudy',
      coberturaNuvens: 35,
      isDia: true,
      horarioReferencia,
      elevacao: 1176,
      timezone: 'America/Sao_Paulo',
    },
    qualidadeAr: {
      iqa: 74,
      categoria: 'Boa',
      cor: '#7CB342',
      pm25: 18.6,
      pm10: 30.2,
      poluentes: [
        { nome: 'PM2.5', valor: 18.6, unidade: 'μg/m³', descricao: 'Partículas finas' },
        { nome: 'PM10', valor: 30.2, unidade: 'μg/m³', descricao: 'Material particulado grosso' },
        { nome: 'O₃', valor: 28, unidade: 'μg/m³', descricao: 'Ozônio' },
      ],
      co: 440,
      no2: 18,
      so2: 7,
      o3: 28,
      uvIndex: 4,
      poeira: 11.2,
      horarioReferencia,
      timezone: 'America/Sao_Paulo',
      aviso:
        'Estimativa de modelo atmosférico (CAMS). Não representa medição de estação local.',
    },
    mensagem:
      'Dados de demonstração do protótipo. Não representam medições reais do ambiente.',
  };
}

/**
 * Camada pronta para a API ambiental.
 * Enquanto o endpoint não estiver configurado, devolve dados de demonstração
 * claramente identificados para manter a interface funcional sem simular medições reais.
 */
export async function obterDadosAmbientais(
  _latitude: number | null,
  _longitude: number | null
): Promise<ResultadoAmbiente> {
  return criarDadosDemonstracao();
}
