import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import fs from "fs";

export default defineConfig({
  server: {
    port: 8080,
    proxy: getProxyOptions(),
   
    historyApiFallback: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
			injectRegister: null,
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "WMS App",
        short_name: "WMS",
        start_url: "/wms",
        display: "standalone",
        background_color: "#ffffff",
        lang: "en",
        scope: "/assets/wms/frontend/",
        description: "Warehouse Management System at your fingertips",
        icons: [
          {
            src: "/assets/wms/manifest/256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/assets/wms/manifest/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/assets/wms/manifest/1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../wms/public/frontend",
    emptyOutDir: true,
    target: "es2015",
    commonjsOptions: {
      include: [/tailwind.config.js/, /node_modules/],

    },
    rollupOptions: {
			output: {
				manualChunks: {
					"frappe-ui": ["frappe-ui"],
				},
			},
		},
	base: "/wms",
  },
  optimizeDeps: {
    include: ["feather-icons", "showdown", "tailwind.config.js", "engine.io-client"],
  },
 
 
});

function getProxyOptions() {
  const config = getCommonSiteConfig();
  const webserver_port = config ? config.webserver_port : 8000;
  if (!config) {
    console.log("No common_site_config.json found, using default port 8000");
  }
  return {
    "^/(app|login|api|assets|files|private)": {
      target: `http://127.0.0.1:${webserver_port}`,
      ws: true,
      router: function (req) {
        const site_name = req.headers.host.split(":")[0];
        console.log(`Proxying ${req.url} to ${site_name}:${webserver_port}`);
        return `http://${site_name}:${webserver_port}`;
      },
    },
  };
}

function getCommonSiteConfig() {
  let currentDir = path.resolve(".");
  
  while (currentDir !== "/") {
    if (fs.existsSync(path.join(currentDir, "sites")) && fs.existsSync(path.join(currentDir, "apps"))) {
      let configPath = path.join(currentDir, "sites", "common_site_config.json");
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath));
      }
      return null;
    }
    currentDir = path.resolve(currentDir, "..");
  }
  return null;
}
