export const TiposOcorrencia = {
  alagamento: {
    label: 'Alagamento',
    icone: 'water',
    cor: '#1565C0',
  },
  fumaca: {
    label: 'Fumaça',
    icone: 'smoke',
    cor: '#616161',
  },
  descarte_irregular: {
    label: 'Descarte Irregular',
    icone: 'trash-can',
    cor: '#E65100',
  },
  buraco_via: {
    label: 'Buraco na Via',
    icone: 'road',
    cor: '#6A1B9A',
  },
  desmatamento_urbano: {
    label: 'Desmatamento Urbano',
    icone: 'tree',
    cor: '#2E7D32',
  },
  outro: {
    label: 'Outro',
    icone: 'alert-circle',
    cor: '#F57C00',
  },
} as const;
