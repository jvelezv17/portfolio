import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { proyectos } from '../src/data/proyectos';
import { perfil } from '../src/data/perfil';

/** Falla la prueba si la página escribe errores en consola o algún recurso propio responde 4xx/5xx. */
function vigilarErrores(page: Page) {
  const errores: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errores.push(`consola: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errores.push(`js: ${err.message}`));
  page.on('response', (res) => {
    const propio = res.url().startsWith('http://localhost');
    if (propio && res.status() >= 400 && !res.url().includes('/no-existe')) {
      errores.push(`${res.status()} ${res.url()}`);
    }
  });
  return errores;
}

test.describe('Carga', () => {
  test('el inicio carga con nombre, rol y frase de valor', async ({ page }) => {
    const errores = vigilarErrores(page);
    await page.goto('/');

    await expect(page).toHaveTitle(new RegExp(perfil.nombre));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(perfil.nombre);
    await expect(page.getByText(perfil.rol).first()).toBeVisible();
    await expect(page.getByText(perfil.frase)).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('cada sección principal existe', async ({ page }) => {
    await page.goto('/');
    for (const nombre of ['Casos de estudio' /* eyebrow */]) {
      await expect(page.getByText(nombre, { exact: true })).toBeVisible();
    }
    for (const titulo of ['Experiencia', 'Stack', 'Contacto']) {
      await expect(page.getByRole('heading', { level: 2, name: titulo })).toBeVisible();
    }
    await expect(page.getByTestId('tarjeta-proyecto')).toHaveCount(proyectos.length);
    await expect(page.getByTestId('trabajo').first()).toBeVisible();
  });
});

test.describe('Navegación', () => {
  test('el menú lleva a cada sección', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: 'Principal' });
    for (const [enlace, id] of [
      ['Proyectos', 'proyectos'],
      ['Experiencia', 'experiencia'],
      ['Stack', 'stack'],
      ['Contacto', 'contacto'],
    ]) {
      await menu.getByRole('link', { name: enlace }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  for (const p of proyectos) {
    test(`caso "${p.slug}": tarjeta → detalle → volver`, async ({ page }) => {
      const errores = vigilarErrores(page);
      await page.goto('/');
      await page.getByRole('link', { name: p.titulo }).click();

      await expect(page).toHaveURL(new RegExp(`/proyectos/${p.slug}/$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.titulo);
      for (const bloque of ['El problema', 'Qué hice', 'Resultado']) {
        await expect(page.getByRole('heading', { level: 2, name: bloque })).toBeVisible();
      }

      await page.getByRole('link', { name: '← Todos los casos' }).click();
      await expect(page).toHaveURL(/\/#proyectos$/);
      expect(errores).toEqual([]);
    });
  }

  test('una URL que no existe muestra la página 404', async ({ page }) => {
    const res = await page.goto('/no-existe');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Esta página no existe' })).toBeVisible();
    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(perfil.nombre);
  });
});

test.describe('Enlaces', () => {
  test('ningún enlace interno está roto', async ({ page, request }) => {
    const pendientes = ['/'];
    const visitadas = new Set<string>();

    while (pendientes.length) {
      const ruta = pendientes.shift()!;
      if (visitadas.has(ruta)) continue;
      visitadas.add(ruta);

      const res = await request.get(ruta);
      expect(res.status(), `enlace roto: ${ruta}`).toBe(200);

      await page.goto(ruta);
      const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
      for (const href of hrefs) {
        if (!href.startsWith('/')) continue; // externos, mailto y anclas se revisan aparte
        const sinAncla = href.split('#')[0] || '/';
        if (!visitadas.has(sinAncla)) pendientes.push(sinAncla);
      }
    }
    // inicio + todos los casos de estudio
    expect(visitadas.size).toBeGreaterThanOrEqual(1 + proyectos.length);
  });

  test('las anclas internas apuntan a un id que existe', async ({ page }) => {
    await page.goto('/');
    const anclas = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll((as) =>
      as.map((a) => a.getAttribute('href')!.split('#')[1]),
    );
    for (const id of new Set(anclas)) {
      if (!id) continue;
      await expect(page.locator(`#${id}`), `falta el id #${id}`).toHaveCount(1);
    }
  });

  test('los enlaces externos son https y abren en otra pestaña de forma segura', async ({ page }) => {
    await page.goto('/');
    const externos = page.locator('a[href^="http"]');
    const total = await externos.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      const enlace = externos.nth(i);
      await expect(enlace).toHaveAttribute('href', /^https:\/\//);
      await expect(enlace).toHaveAttribute('target', '_blank');
      await expect(enlace).toHaveAttribute('rel', /noopener/);
    }
  });

  test('el correo de contacto es un mailto válido', async ({ page }) => {
    test.skip(!perfil.email, 'sin correo configurado');
    await page.goto('/');
    await expect(page.locator('#contacto a[href^="mailto:"]')).toHaveAttribute('href', `mailto:${perfil.email}`);
  });
});

test.describe('Calidad', () => {
  test('no hay scroll horizontal (la página cabe en el ancho de la pantalla)', async ({ page }) => {
    for (const ruta of ['/', `/proyectos/${proyectos[0].slug}/`]) {
      await page.goto(ruta);
      const desborde = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(desborde, `scroll horizontal en ${ruta}`).toBeLessThanOrEqual(0);
    }
  });

  test('sin problemas de accesibilidad graves (axe)', async ({ page }) => {
    for (const ruta of ['/', `/proyectos/${proyectos[0].slug}/`]) {
      await page.goto(ruta);
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(graves.map((v) => `${v.id}: ${v.help}`), `en ${ruta}`).toEqual([]);
    }
  });
});
