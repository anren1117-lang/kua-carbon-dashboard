import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zatqfxpwmijevqfjfrjn.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SNG4ht6x3gpz5uArEc8HWQ_2932-X-0';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
