import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Os arquivos de cada cenário são independentes; execução paralela não sobrescreve relatórios.
const screens = [
  { name: 'mobile-320', width: 320, height: 640 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1600', width: 1600, height: 900 },
  { name: 'wide-1920', width: 1920, height: 1080 }
];
const routes = [
  { name: 'dashboard', hash: '/', heading: 'Postagens' },
  { name: 'cadastro', hash: '/cadastro', heading: 'Nova postagem' },
  { name: 'detalhes', hash: '/detalhes/101', heading: 'Detalhes da postagem' },
  { name: 'edicao', hash: '/editar/101', heading: 'Editar postagem' },
  { name: 'exclusao', hash: '/excluir/101', heading: 'Detalhes da postagem', dialog: true }
];

function isSameOrigin(url, origin) {
  try { return new URL(url).origin === origin; } catch { return false; }
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const horizontalOverflow = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    ) - width;
    const targets = document.querySelectorAll('h1,h2,h3,a,button,input,textarea,select,[role="button"],[role="dialog"]');
    const clippedControls = [...targets].filter(node => {
      if (node.closest('.table-scroll')) return false; // rolagem intencional da tabela
      if (node.closest('.sr-only')) return false;
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      if (node.closest('dialog:not([open])')) return false;
      return rect.left < -2 || rect.right > width + 2;
    }).slice(0, 20).map(node => ({
      tag: node.tagName.toLowerCase(),
      text: (node.getAttribute('aria-label') || node.textContent || '').trim().slice(0, 70),
      left: Math.round(node.getBoundingClientRect().left),
      right: Math.round(node.getBoundingClientRect().right)
    }));
    const scroller = document.querySelector('.table-scroll');
    return {
      viewportWidth: width,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      horizontalOverflow: Math.max(0, horizontalOverflow),
      clippedControls,
      tableScrollsInternally: scroller ? scroller.scrollWidth > scroller.clientWidth : null
    };
  });
}

test.describe('Capturas automáticas e auditoria visual', () => {
  for (const size of screens) {
    for (const route of routes) {
      test(size.name + ' — ' + route.name, async ({ page }, info) => {
        test.skip(info.project.name !== 'chromium', 'A matriz já cobre resoluções mobile no Chromium.');
        const root = join('test-results', 'visual-audit');
        const name = size.name + '-' + route.name;
        mkdirSync(root, { recursive: true });
        await page.setViewportSize({ width: size.width, height: size.height });

        const pageErrors = [];
        const consoleErrors = [];
        const failedRequests = [];
        const badResponses = [];
        const base = new URL(info.project.use.baseURL);
        page.on('pageerror', error => pageErrors.push(error.message));
        page.on('console', msg => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('requestfailed', request => {
          failedRequests.push({ url: request.url(), error: request.failure()?.errorText || '' });
        });
        page.on('response', response => {
          if (response.status() >= 400) badResponses.push({ status: response.status(), url: response.url() });
        });

        await page.goto('./#' + route.hash, { waitUntil: 'networkidle' });
        await expect(page.getByRole('heading', { name: route.heading, exact: true })).toBeVisible();
        if (route.dialog) await expect(page.getByRole('dialog')).toBeVisible();
        if (size.width <= 760 && route.name === 'dashboard') {
          await expect(page.getByText('Deslize a tabela para ver status, data e ações')).toBeVisible();
        }
        if (size.width <= 760 && route.name === 'cadastro') {
          const basic = await page.getByRole('heading', { name: 'Informações básicas' }).boundingBox();
          const publish = await page.getByRole('heading', { name: 'Publicação' }).boundingBox();
          expect(publish.y, 'No celular, a publicação deve aparecer depois do formulário').toBeGreaterThan(basic.y);
        }
        if (route.name === 'dashboard') {
          await expect(page.getByRole('link', { name: 'Como organizar um calendário editorial', exact: true })).toBeVisible();
        }
        const screenshot = join(root, name + '.png');
        await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
        const layout = await inspectLayout(page);
        const sameOriginRequestErrors = failedRequests.filter(req => isSameOrigin(req.url, base.origin));
        const sameOriginHTTP = badResponses.filter(req => isSameOrigin(req.url, base.origin));
        // Ruídos de fontes externas ficam registrados, mas não invalidam a aplicação.
        const appConsoleErrors = consoleErrors.filter(message => !/fonts\.googleapis\.com|fonts\.gstatic\.com|net::ERR_/i.test(message));
        const result = {
          route: route.hash, screenshot, viewport: size,
          errors: { pageErrors, consoleErrors, failedRequests, badResponses },
          layout,
          passed: !pageErrors.length && !appConsoleErrors.length &&
            !sameOriginRequestErrors.length && !sameOriginHTTP.length &&
            layout.horizontalOverflow <= 1 && !layout.clippedControls.length
        };
        writeFileSync(join(root, name + '.json'), JSON.stringify(result, null, 2));
        expect(pageErrors, 'Exceções JavaScript em ' + name).toEqual([]);
        expect(appConsoleErrors, 'Erros de console em ' + name).toEqual([]);
        expect(sameOriginRequestErrors, 'Falhas de requisições locais em ' + name).toEqual([]);
        expect(sameOriginHTTP, 'Recursos HTTP com erro em ' + name).toEqual([]);
        expect(layout.horizontalOverflow, 'Scroll horizontal na página em ' + name).toBeLessThanOrEqual(1);
        expect(layout.clippedControls, 'Elementos interativos cortados em ' + name).toEqual([]);
      });
    }
  }
});
