// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cppeogogtxrktdcriama.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcGVvZ29ndHhya3RkY3JpYW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NTU0MTcsImV4cCI6MjA0NTQzMTQxN30.6l0EdU0aBcRUzQF3gMAErsI_KIzhc5Pidr9eSEl-Rwg"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
