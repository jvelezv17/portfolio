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
    // el país, con la bandera
    await expect(page.getByTestId('pais')).toContainText('COL');
    await expect(page.getByRole('img', { name: 'Bandera de Colombia' })).toBeVisible();
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

  test('el avatar carga y cada tecnología del stack tiene icono', async ({ page }) => {
    await page.goto('/');
    const avatar = page.getByRole('img', { name: `Avatar de ${perfil.nombre}`, exact: true });
    await expect(avatar).toBeVisible();
    // naturalWidth > 0 = la imagen realmente descargó (no un ícono roto)
    expect(await avatar.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

    const tecnologias = page.getByTestId('tecnologia');
    expect(await tecnologias.count()).toBeGreaterThan(10);
    for (const t of await tecnologias.all()) {
      await expect(t.locator('svg.icono, img.icono, .icono.monograma')).toHaveCount(1);
    }

    // Los logos propios (public/logos) deben descargar de verdad
    const logos = page.locator('img.icono');
    expect(await logos.count()).toBeGreaterThan(0);
    for (const logo of await logos.all()) {
      await logo.scrollIntoViewIfNeeded();
      await expect
        .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);
    }
  });
});

test.describe('Avatar animado', () => {
  test('en Contacto carga el avatar animado y pesa poco', async ({ page, request }) => {
    await page.goto('/');
    const mascota = page.getByTestId('mascota-contacto');
    await mascota.scrollIntoViewIfNeeded(); // es lazy: solo carga al llegar a Contacto
    await expect
      .poll(() => mascota.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);

    // WebP animado: el archivo trae el bloque ANIM y no se pasa de 1,5 MB
    const res = await request.get('/avatar/contacto.webp');
    const bytes = await res.body();
    expect(bytes.includes(Buffer.from('ANIM')), 'el WebP no es animado').toBe(true);
    expect(bytes.length).toBeLessThan(1.5 * 1024 * 1024);
  });

  test('con "reducir movimiento" muestra la imagen fija', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const mascota = page.getByTestId('mascota-contacto');
    await mascota.scrollIntoViewIfNeeded();
    await expect
      .poll(() => mascota.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toContain('/avatar/contacto-quieto.webp');
    // sin animaciones: el globo ya trae el texto completo, sin torbellino ni tecleo
    await expect(page.getByTestId('globo-contacto').locator('.globo-texto')).toHaveText('¡Hablemos!');
    await expect(page.getByTestId('globo-contacto')).not.toHaveClass(/oculto/);
  });

  test('el globo sale del torbellino y escribe "¡Hablemos!" letra por letra', async ({ page }) => {
    await page.goto('/');
    const globo = page.getByTestId('globo-contacto');
    const texto = globo.locator('.globo-texto');
    // antes de llegar a Contacto, el globo está escondido y vacío
    await expect(globo).toHaveClass(/oculto/);
    await expect(texto).toHaveText('');

    await page.getByTestId('mascota-contacto').scrollIntoViewIfNeeded();
    // primero el torbellino (durante la primera voltereta)…
    await expect(globo).toHaveClass(/torbellino-activo/, { timeout: 5_000 });
    // …luego el texto va apareciendo por partes, hasta quedar completo
    await expect(texto).toHaveText(/^¡Hab?/, { timeout: 5_000 });
    await expect(texto).toHaveText('¡Hablemos!', { timeout: 5_000 });
    await expect(globo).not.toHaveClass(/oculto|torbellino-activo/);

    // y en la siguiente voltereta se repite: el globo vuelve al torbellino y se escribe de nuevo
    await expect(globo).toHaveClass(/torbellino-activo/, { timeout: 5_000 });
    await expect(texto).toHaveText('', { timeout: 1_000 });
    await expect(texto).toHaveText('¡Hablemos!', { timeout: 5_000 });
  });
});

test.describe('Easter egg: el bug que camina', () => {
  test('el bicho aparece, camina y al atraparlo lleva a "¡Cazaste un bug!"', async ({ page }) => {
    await page.goto('/?bicho'); // ?bicho lo hace salir enseguida
    const bicho = page.getByTestId('bicho');
    await expect(bicho).toBeVisible({ timeout: 5_000 });

    // camina: su posición cambia con el tiempo
    const antes = await bicho.boundingBox();
    await expect.poll(async () => {
      const ahora = await bicho.boundingBox();
      return Math.hypot(ahora!.x - antes!.x, ahora!.y - antes!.y);
    }).toBeGreaterThan(10);

    // atraparlo (se mueve, así que el click se envía directo al botón)
    await bicho.dispatchEvent('click');
    await expect(bicho).toHaveClass(/cazado/);
    await expect(page).toHaveURL(/\/bug-encontrado\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¡Cazaste un bug!');
    await expect(page.getByTestId('ticket-bug')).toContainText('BUG-404');
    await expect(page.getByTestId('mascota-404')).toBeVisible();
  });

  test('la página del easter egg no se indexa y no tiene su propio bicho', async ({ page }) => {
    await page.goto('/bug-encontrado/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.getByTestId('bicho')).toHaveCount(0);
  });

  test('con "reducir movimiento" el bicho no sale', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?bicho');
    await page.waitForTimeout(800);
    await expect(page.getByTestId('bicho')).toBeHidden();
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
    // el avatar cayéndose carga y es un WebP animado
    const mascota = page.getByTestId('mascota-404');
    await expect
      .poll(() => mascota.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    const webp = await page.request.get('/avatar/404.webp');
    expect((await webp.body()).includes(Buffer.from('ANIM')), 'el WebP de la 404 no es animado').toBe(true);
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
