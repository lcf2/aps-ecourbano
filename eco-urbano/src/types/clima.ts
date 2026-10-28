export interface DadosPoluente {
  nome: string;
  valor: number;
  unidade: string;
  descricao: string;
}

export interface DadosQualidadeAr {
  iqa: number;
  categoria: string;
  cor: string;
  pm25: number;
  pm10: number;
  poluentes: DadosPoluente[];
  co: number;           // carbon_monoxide μg/m³
  no2: number;          // nitrogen_dioxide μg/m³
  so2: number;          // sulphur_dioxide μg/m³
  o3: number;           // ozone μg/m³
  uvIndex: number;      // uv_index adimensional
  poeira: number;       // dust μg/m³
  horarioReferencia: string; // ISO string da API
  timezone: string;     // ex: "America/Sao_Paulo"
  aviso: string;        // sempre "Estimativa de modelo atmosférico (CAMS). Não representa medição de estação local."
}

export interface DadosClima {
  temperatura: number;
  sensacaoTermica: number;
  umidade: number;
  velocidadeVento: number;
  precipitacao: number;
  pressao: number;
  codigoClima: number;
  descricao: string;
  icone: string;
  coberturaNuvens: number;    // cloud_cover %
  isDia: boolean;             // is_day
  horarioReferencia: string;  // ISO string da API
  elevacao: number;           // elevation da resposta
  timezone: string;           // ex: "America/Sao_Paulo"
}
