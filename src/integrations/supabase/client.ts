// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ewatpnqadoofwlydtuzh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YXRwbnFhZG9vZndseWR0dXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMTQ3NjgsImV4cCI6MjA1MjU5MDc2OH0.c1qdPeqZiosZ1K5J4Pnrppc7QSMFFtAadyVl9BInHS0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);