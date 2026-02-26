import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zatqfxpwmijeqqfjfrjn.supabase.co';
const supabaseKey = 'sb_publishable_SNG4ht6x3gpz5uArEc8HWQ_2932-X-0';

export const supabase = createClient(supabaseUrl, supabaseKey);
