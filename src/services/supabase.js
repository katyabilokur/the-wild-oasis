import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://rcxbrotezsmarvvchhjm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeGJyb3RlenNtYXJ2dmNoaGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3NTI3MDksImV4cCI6MjAyMDMyODcwOX0.zMS1YbvUY0bNzYEvUG-sU0NKVsEYL5mGOOKwLFO_FUw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
