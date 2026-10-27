import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

test('GitHub Pages entrega PostFlow compilado e sem erro de JavaScript', async ({ page }) => {
  const errors = [];
  const blocked = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('response', response => {
    if (response.status() >= 400 && new URL(response.url()).origin === new URL(test.info().project.use.baseURL).origin) {
      blocked.push(response.status() + ' ' + response.url());
    }
  });
  await page.goto('./#/', { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/PostFlow/);
  await expect(page.getByRole('heading', { name: 'Postagens', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Como organizar um calendário editorial', exact: true })).toBeVisible();
  mkdirSync('test-results/pages-live', { recursive: true });
  await page.screenshot({ path:'test-results/pages-live/dashboard-1365.png', fullPage: true });
  expect(errors, 'Exceções no site publicado').toEqual([]);
  expect(blocked, 'Assets da aplicação com erros HTTP').toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path:'test-results/pages-live/dashboard-375.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.getByRole('link', { name: 'Nova postagem' }).first().click();
  await expect(page.getByRole('heading', { name: 'Nova postagem' })).toBeVisible();
  await page.screenshot({ path:'test-results/pages-live/cadastro-375.png', fullPage: true });
});
