import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";

try {
  fs.rmSync(".nitro", { recursive: true, force: true });
  fs.rmSync(".vercel", { recursive: true, force: true });
  fs.rmSync("node_modules/@supabase/auth-js", { recursive: true, force: true });
} catch (e) {}

export default defineConfig({
  nitro: {
    preset: "vercel",
    externals: {
      inline: ["tslib", "@supabase/supabase-js", "@supabase/auth-js"]
    },
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
});
