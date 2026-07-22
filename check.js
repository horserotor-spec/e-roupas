import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

supabase.from("system_settings").select("*").eq("key", "bling_integration").then(res => {
  console.log(JSON.stringify(res.data, null, 2));
  process.exit(0);
});
