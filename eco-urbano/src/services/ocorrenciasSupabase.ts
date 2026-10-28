import type { Ocorrencia } from '@/types/ocorrencia';
import { getSupabaseClient } from '@/lib/supabase';

interface OcorrenciaSupabaseRow {
  id: string;
  user_id: string;
  title: string;
  type: Ocorrencia['tipo'];
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: Ocorrencia['status'];
  created_at: string;
  updated_at: string | null;
}

function mapearLinha(row: OcorrenciaSupabaseRow): Ocorrencia {
  return {
    id: row.id,
    titulo: row.title ?? row.description,
    tipo: row.type,
    descricao: row.description,
    endereco: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status,
    criadoEm: new Date(row.created_at),
  };
}

async function obterUsuarioAtual() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  return data.user;
}

export async function listarOcorrenciasSupabase(): Promise<Ocorrencia[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('ocorrencias')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as OcorrenciaSupabaseRow[] | null ?? []).map(mapearLinha);
}

export async function obterOcorrenciaSupabase(id: string): Promise<Ocorrencia | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('ocorrencias')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapearLinha(data as OcorrenciaSupabaseRow);
}

export async function criarOcorrenciaSupabase(ocorrencia: Ocorrencia): Promise<Ocorrencia> {
  const usuario = await obterUsuarioAtual();
  const supabase = getSupabaseClient();

  const payload = {
    user_id: usuario.id,
    title: ocorrencia.titulo,
    type: ocorrencia.tipo,
    description: ocorrencia.descricao,
    address: ocorrencia.endereco,
    latitude: ocorrencia.latitude,
    longitude: ocorrencia.longitude,
    status: ocorrencia.status,
    created_at: ocorrencia.criadoEm.toISOString(),
  };

  const { data, error } = await supabase
    .from('ocorrencias')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapearLinha(data as OcorrenciaSupabaseRow);
}

export async function atualizarOcorrenciaSupabase(
  id: string,
  updates: Partial<Pick<Ocorrencia, 'status' | 'descricao' | 'endereco'>>
): Promise<Ocorrencia> {
  const usuario = await obterUsuarioAtual();
  const supabase = getSupabaseClient();

  const payload: Record<string, string | number | null> = {};

  if (updates.status) {
    payload.status = updates.status;
  }

  if (updates.descricao) {
    payload.description = updates.descricao;
  }

  if (updates.endereco) {
    payload.address = updates.endereco;
  }

  const { data, error } = await supabase
    .from('ocorrencias')
    .update(payload)
    .eq('id', id)
    .eq('user_id', usuario.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapearLinha(data as OcorrenciaSupabaseRow);
}
