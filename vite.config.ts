import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"
import framer from "vite-plugin-framer"

// https://vitejs.dev/config/
// mkcert (a local HTTPS certificate Framer's dev mode needs) only runs for `npm run dev`.
export default defineConfig(({ command }) => ({
    plugins: [react(), ...(command === "serve" ? [mkcert()] : []), framer()],
}))
