import { Cores } from '@/constants/cores';

export const Tema = {
  cores: {
    primaria: Cores.verde.escuro,
    primariaMedia: Cores.verde.medio,
    primariaClara: Cores.verde.claro,
    secundaria: Cores.azul.escuro,
    secundariaMedia: Cores.azul.medio,
    secundariaClara: Cores.azul.claro,
    fundo: Cores.cinza.fundo,
    superficie: Cores.branco,
    texto: '#1B1B1B',
    textoSuave: Cores.cinza.escuro,
    textoMudo: Cores.cinza.medio,
    borda: '#E0E0E0',
    erro: Cores.erro,
    aviso: Cores.aviso,
    sucesso: Cores.sucesso,
    info: Cores.info,
  },
  espaco: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  raio: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
  },
} as const;
