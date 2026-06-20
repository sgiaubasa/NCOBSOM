import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/get-reportes': {
        target: 'https://default9444ead097714ed8a608802faff70d.4f.environment.api.powerplatform.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/get-reportes/, '/powerautomate/automations/direct/workflows/4c354193a86d4357837d7876a83cf650/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_snf62zsJq3YjzCRSDZAGGegs7WZNR9jg-Ilw_reuTk')
      },
      '/api/get-info-doc': {
        target: 'https://default9444ead097714ed8a608802faff70d.4f.environment.api.powerplatform.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/get-info-doc/, '/powerautomate/automations/direct/workflows/705cca51e17c4196ab25c0969cd86fda/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VQyOE-TwuuFl2KstcwrN8aXAf89QBjN8gxMCh7IrRbk')
      },
      '/api/post-info-doc': {
        target: 'https://default9444ead097714ed8a608802faff70d.4f.environment.api.powerplatform.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/post-info-doc/, '/powerautomate/automations/direct/workflows/e68d5f28ecae417795d02850be8d1060/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Z-bCVYx6z2hrTVThJWv1tZDLwa2Wmn7jthW0xllU5sA')
      },
      '/api/update-info-doc': {
        target: 'https://default9444ead097714ed8a608802faff70d.4f.environment.api.powerplatform.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/update-info-doc/, '/powerautomate/automations/direct/workflows/5c1f24c9c67b44739b7aad45b6aa8e7f/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7An4ZeGB97FRJ-A65sktQnI-19IySipVRWWT3HWEYLo')
      }
    }
  }
})
