import { getSupabaseClient } from '@/lib/supabase';

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  const resposta = await supabase.auth.signInWithPassword({ email, password });

  if (resposta.error) {
    throw new Error(resposta.error.message);
  }

  return resposta.data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
) {
  const supabase = getSupabaseClient();
  const resposta = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (resposta.error) {
    throw new Error(resposta.error.message);
  }

  return resposta.data;
}

export async function signOutFromSupabase() {
  const supabase = getSupabaseClient();
  const resposta = await supabase.auth.signOut();

  if (resposta.error) {
    throw new Error(resposta.error.message);
  }
}

export async function getSupabaseSession() {
  const supabase = getSupabaseClient();
  const resposta = await supabase.auth.getSession();

  if (resposta.error) {
    throw new Error(resposta.error.message);
  }

  return resposta.data.session;
}
