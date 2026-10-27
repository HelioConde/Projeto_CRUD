import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Inclui alturas reais da área útil do navegador, não apenas a resolução do monitor.
const viewports = [
  { width: 1365, height: 645, name: 'edge-1365x645' },
  { width: 1600, height: 646, name: 'edge-1600x646' },
  { width: 1280, height: 620, name: 'compact-1280x620' },
  { width: 1024, height: 640, name: 'laptop-1024x640' },
  { width: 900, height: 600, name: 'compact-900x600' },
  { width: 1365, height: 768, name: 'desktop-1365x768' },
  { width: 1600, height: 900, name: 'desktop-1600x900' }
];

test.describe('Dashboard: uma tela útil no desktop', () => {
  for (const viewport of viewports) {
    test(viewport.name + ': cabeçalho e paginação visíveis, rolagem na tabela', async ({ page }, info) => {
      test.skip(info.project.name === 'mobile', 'A matriz desktop é executada apenas no Chromium');
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto('./#/', { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { name: 'Postagens', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Como organizar um calendário editorial', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Próxima' })).toBeVisible();
      const geometry = await page.evaluate(() => {
        const bounds = selector => {
          const box = document.querySelector(selector)?.getBoundingClientRect();
          return box && { top:box.top, bottom:box.bottom, height:box.height };
        };
        const table = document.querySelector('.table-scroll');
        return {
          viewport:innerHeight,
          documentHeight:document.scrollingElement.scrollHeight,
          shell:bounds('.app-shell'),
          header:bounds('.topbar'),
          cards:bounds('.stats-grid'),
          filters:bounds('.toolbar'),
          pagination:bounds('.pagination'),
          footer:bounds('.site-footer'),
          table:bounds('.table-scroll'),
          tableScrollHeight:table.scrollHeight,
          tableClientHeight:table.clientHeight
        };
      });
      const folder = join('test-results', 'viewport-fit');
      mkdirSync(folder, { recursive:true });
      await page.screenshot({ path:join(folder, viewport.name+'.png'), fullPage:true, animations:'disabled' });
      writeFileSync(join(folder, viewport.name+'.json'), JSON.stringify(geometry,null,2));
      expect(pageErrors, 'JavaScript sem exceções').toEqual([]);
      expect(geometry.documentHeight, 'A página inteira deve caber no viewport CSS').toBeLessThanOrEqual(viewport.height + 2);
      for (const key of ['header','cards','filters','pagination','footer']) {
        expect(geometry[key].top, key + ' acima da área visível').toBeGreaterThanOrEqual(-2);
        expect(geometry[key].bottom, key + ' abaixo da área visível').toBeLessThanOrEqual(viewport.height + 2);
      }
      expect(geometry.table.height, 'Tabela deve reservar espaço de leitura').toBeGreaterThan(65);
      expect(geometry.tableScrollHeight, 'Linhas longas devem rolar dentro da tabela').toBeGreaterThan(geometry.tableClientHeight + 5);
      await page.locator('.table-scroll').evaluate(el => { el.scrollTop = el.scrollHeight; });
      expect(await page.locator('.table-scroll').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      await expect(page.getByRole('button', { name:'Próxima' })).toBeVisible();
      await page.getByRole('button', { name:'Próxima' }).click();
      await expect(page.getByText('Página 2 de 2')).toBeVisible();
    });
  }

  test('mobile e altura insuficiente mantêm rolagem natural sem cortar navegação', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'Cobertura única para os breakpoints');
    for (const viewport of [{ width:390,height:640 },{ width:1365,height:490 }]) {
      await page.setViewportSize(viewport);
      await page.goto('./#/');
      await expect(page.getByRole('heading', { name:'Postagens', exact:true })).toBeVisible();
      await page.getByRole('button', { name:'Próxima' }).scrollIntoViewIfNeeded();
      await expect(page.getByRole('button', { name:'Próxima' })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
  });
});
