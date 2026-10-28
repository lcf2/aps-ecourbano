import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { hasSupabaseConfig } from '@/lib/supabase';
import { obterDadosAmbientais } from '@/services/ambiente';
import { obterLocalidadeAtual } from '@/services/localidade';
import {
  listarOcorrencias,
  salvarOcorrencia as persistirOcorrencia,
} from '@/services/ocorrencias';
import {
  criarOcorrenciaSupabase,
  listarOcorrenciasSupabase,
} from '@/services/ocorrenciasSupabase';
import type { DadosClima, DadosQualidadeAr } from '@/types/clima';
import type { Localidade } from '@/types/localidade';
import type { Ocorrencia } from '@/types/ocorrencia';

interface EstadoAmbiente {
  clima: DadosClima | null;
  qualidadeAr: DadosQualidadeAr | null;
  mensagem: string;
}

interface AppContextValor {
  localidade: Localidade;
  localidadeCarregando: boolean;
  localidadeErro: string | null;
  recarregarLocalidade: () => Promise<void>;
  ambiente: EstadoAmbiente;
  ambienteCarregando: boolean;
  recarregarAmbiente: () => Promise<void>;
  ocorrencias: Ocorrencia[];
  ocorrenciasCarregando: boolean;
  ocorrenciasErro: string | null;
  recarregarOcorrencias: () => Promise<void>;
  registrarOcorrencia: (ocorrencia: Ocorrencia) => Promise<void>;
}

const LOCALIDADE_INICIAL: Localidade = {
  latitude: null,
  longitude: null,
  rotulo: 'Nenhuma localidade selecionada',
  origem: 'indefinida',
};

const AppContext = createContext<AppContextValor | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [localidade, setLocalidade] = useState<Localidade>(LOCALIDADE_INICIAL);
  const [localidadeCarregando, setLocalidadeCarregando] = useState(true);
  const [localidadeErro, setLocalidadeErro] = useState<string | null>(null);

  const [ambiente, setAmbiente] = useState<EstadoAmbiente>({
    clima: null,
    qualidadeAr: null,
    mensagem: '',
  });
  const [ambienteCarregando, setAmbienteCarregando] = useState(true);

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [ocorrenciasCarregando, setOcorrenciasCarregando] = useState(true);
  const [ocorrenciasErro, setOcorrenciasErro] = useState<string | null>(null);

  const recarregarLocalidade = useCallback(async () => {
    setLocalidadeCarregando(true);
    setLocalidadeErro(null);
    try {
      const atual = await obterLocalidadeAtual();
      setLocalidade(atual);
    } catch (erro) {
      setLocalidade(LOCALIDADE_INICIAL);
      setLocalidadeErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível obter a localização.'
      );
    } finally {
      setLocalidadeCarregando(false);
    }
  }, []);

  const recarregarAmbiente = useCallback(async () => {
    setAmbienteCarregando(true);
    try {
      const resultado = await obterDadosAmbientais(
        localidade.latitude,
        localidade.longitude
      );
      setAmbiente(resultado);
    } finally {
      setAmbienteCarregando(false);
    }
  }, [localidade.latitude, localidade.longitude]);

  const recarregarOcorrencias = useCallback(async () => {
    setOcorrenciasCarregando(true);
    setOcorrenciasErro(null);
    try {
      const usarSupabase = Boolean(session && hasSupabaseConfig());
      const lista = usarSupabase ? await listarOcorrenciasSupabase() : await listarOcorrencias();
      setOcorrencias(lista);
    } catch (erro) {
      setOcorrenciasErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar as ocorrências salvas neste aparelho.'
      );
    } finally {
      setOcorrenciasCarregando(false);
    }
  }, [session]);

  const registrarOcorrencia = useCallback(async (ocorrencia: Ocorrencia) => {
    if (session && hasSupabaseConfig()) {
      await criarOcorrenciaSupabase(ocorrencia);
    } else {
      await persistirOcorrencia(ocorrencia);
    }
    await recarregarOcorrencias();
  }, [recarregarOcorrencias, session]);

  useEffect(() => {
    void recarregarLocalidade();
    void recarregarOcorrencias();
  }, [recarregarLocalidade, recarregarOcorrencias]);

  useEffect(() => {
    void recarregarAmbiente();
  }, [recarregarAmbiente]);

  const valor = useMemo(
    () => ({
      localidade,
      localidadeCarregando,
      localidadeErro,
      recarregarLocalidade,
      ambiente,
      ambienteCarregando,
      recarregarAmbiente,
      ocorrencias,
      ocorrenciasCarregando,
      ocorrenciasErro,
      recarregarOcorrencias,
      registrarOcorrencia,
    }),
    [
      localidade,
      localidadeCarregando,
      localidadeErro,
      recarregarLocalidade,
      ambiente,
      ambienteCarregando,
      recarregarAmbiente,
      ocorrencias,
      ocorrenciasCarregando,
      ocorrenciasErro,
      recarregarOcorrencias,
      registrarOcorrencia,
    ]
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  const contexto = useContext(AppContext);
  if (!contexto) {
    throw new Error('useApp deve ser usado dentro de AppProvider.');
  }
  return contexto;
}
