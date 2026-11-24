import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

// Por defecto las pruebas corren contra el sitio YA COMPILADO en tu PC (lo mismo que se publica).
// Con PRUEBAS_URL corren contra el sitio publicado, sin compilar nada:
//   npm run test:vivo   (= PRUEBAS_URL=https://juanvelezqa.netlify.app playwright test)
const enVivo = process.env.PRUEBAS_URL;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI || enVivo ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: enVivo ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
  webServer: enVivo
    ? undefined
    : {
        command: `npm run build && npm run preview -- --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
