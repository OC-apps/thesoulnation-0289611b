
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Proyecto independiente de The Soul Nation
const SUPABASE_URL =
  'https://quscgfasziijdjyixsex.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_AT5FDfqPulWKJOHrDsag1Q_9hlAVrl6';

function createSupabaseClient() {
  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storage:
          typeof window !== 'undefined'
            ? window.localStorage
            : undefined,
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
      },
    }
  );
}

let _supabase:
  | ReturnType<typeof createSupabaseClient>
  | undefined;

// Cliente compartido para consultar Supabase
export const supabase = new Proxy(
  {} as ReturnType<typeof createSupabaseClient>,
  {
    get(_, prop, receiver) {
      if (!_supabase) {
        _supabase = createSupabaseClient();
      }

      return Reflect.get(_supabase, prop, receiver);
    },
  }
);
