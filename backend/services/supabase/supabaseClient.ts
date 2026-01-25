import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL;
const SUPABASE_KEY = Constants.expoConfig?.extra?.SUPABASE_KEY;
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_KEY ? '***REDACTED***' : 'MISSING');

if (!SUPABASE_URL) {
  throw new Error('Missing Supabase environment variable: SUPABASE_URL');
}

if (!SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variable: SUPABASE_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
