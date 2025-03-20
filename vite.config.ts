import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Proxy API requests in development
      '/api/deepseek': {
        target: 'http://localhost:3000',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
        // Use custom handler for the API endpoint
        bypass: (req, res) => {
          if (req.url === '/api/deepseek') {
            // Import and use the development proxy
            import('./src/api/deepseek-proxy')
              .then(module => {
                module.POST(req)
                  .then(response => {
                    // Copy status and headers
                    res.statusCode = response.status;
                    response.headers.forEach((value, key) => {
                      res.setHeader(key, value);
                    });
                    
                    // Stream the response body
                    if (response.body) {
                      const reader = response.body.getReader();
                      const pump = () => {
                        reader.read().then(({ done, value }) => {
                          if (done) {
                            res.end();
                            return;
                          }
                          res.write(value);
                          pump();
                        }).catch(err => {
                          console.error('Error streaming response:', err);
                          res.end();
                        });
                      };
                      pump();
                    } else {
                      res.end();
                    }
                  })
                  .catch(error => {
                    console.error('Error processing request:', error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                  });
              })
              .catch(error => {
                console.error('Error importing proxy module:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to load API handler' }));
              });
            
            // Return true to bypass the proxy
            return true;
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Increase the warning limit to suppress the warning message
    chunkSizeWarningLimit: 1000
  }
});
