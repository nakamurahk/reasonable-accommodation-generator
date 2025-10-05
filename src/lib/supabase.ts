import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mjykvtyhddmkhktgqxcn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeWt2dHloZGRta2hrdGdxeGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODMxNTQsImV4cCI6MjA3NTE1OTE1NH0.F6tJ6TWhaFPHa8FKfvKKdWREr_6NNjNlaiwefURfk_0"

export const supabase = createClient(supabaseUrl, supabaseKey)
