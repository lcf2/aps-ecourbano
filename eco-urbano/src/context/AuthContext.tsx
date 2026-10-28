import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import {
  signInWithEmail,
  signOutFromSupabase,
  signUpWithEmail,
  getSupabaseSession,
} from '@/services/auth';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = hasSupabaseConfig();

  const syncSession = useCallback(async () => {
    if (!isConfigured) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const atual = await getSupabaseSession();
      setSession(atual);
      setUser(atual?.user ?? null);
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    void syncSession();
  }, [syncSession]);

  useEffect(() => {
    if (!isConfigured || !supabase) {
      return;
    }

    const subscription = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await signInWithEmail(email, password);
    setSession(data.session);
    setUser(data.user);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const data = await signUpWithEmail(email, password, fullName);
      setSession(data.session);
      setUser(data.user);
    },
    []
  );

  const signOut = useCallback(async () => {
    await signOutFromSupabase();
    setSession(null);
    setUser(null);
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      isConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [isConfigured, loading, session, signIn, signOut, signUp, user]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return contexto;
}
