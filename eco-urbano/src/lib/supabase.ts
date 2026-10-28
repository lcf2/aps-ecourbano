import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      ocorrencias: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: string;
          description: string;
          address: string;
          latitude: number;
          longitude: number;
          status: 'ativo' | 'resolvido';
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: string;
          description?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          status?: 'ativo' | 'resolvido';
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: string;
          description?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          status?: 'ativo' | 'resolvido';
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Faltam as variáveis EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY. Consulte o arquivo .env.example.'
    );
  }

  return supabase;
}
