import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "none",
            startKeycloakOptions: {
                dockerImage: 'quay.io/keycloak/keycloak:26.3.4'
            }
        })
    ]
});
