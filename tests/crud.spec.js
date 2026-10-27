import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a demonstração apresenta postagens, busca, filtros e paginação', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Postagens' })).toBeVisible();
  await expect(page.getByText('12 postagens')).toBeVisible();
  await page.getByRole('button', { name: 'Próxima' }).click();
  await expect(page.getByText('Página 2 de 2')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Buscar postagens por título ou tag' }).fill('calendário editorial');
  await expect(page.getByRole('link', { name: 'Como organizar um calendário editorial' })).toBeVisible();
  await expect(page.getByText('1–1 de 1 postagens')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca' }).click();
  await page.getByLabel('Filtrar pelo status').selectOption('draft');
  await expect(page.getByText('1–4 de 4 postagens')).toBeVisible();
  await page.getByLabel('Ordenar postagens').selectOption('title');
  await expect(page.locator('tbody tr')).toHaveCount(4);
});

test('criar, visualizar, editar e excluir pede confirmação', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Nova postagem' }).first().click();
  await page.getByRole('textbox', { name: 'Título' }).fill('Postagem criada pelo Playwright');
  await page.getByRole('textbox', { name: 'Tags' }).fill('Teste, Automação');
  await page.getByRole('textbox', { name: 'Texto principal' }).fill('Conteúdo de teste.');
  await page.getByRole('button', { name: 'Pré-visualizar' }).click();
  await expect(page.getByText('Conteúdo de teste.')).toBeVisible();
  await page.getByRole('combobox', { name: 'Status' }).selectOption('published');
  await page.getByRole('button', { name: 'Salvar postagem' }).click();
  await expect(page.getByRole('link', { name: 'Postagem criada pelo Playwright' })).toBeVisible();
  await page.getByRole('link', { name: 'Postagem criada pelo Playwright' }).click();
  await expect(page.getByRole('heading', { name: 'Postagem criada pelo Playwright' })).toBeVisible();
  await page.getByRole('link', { name: 'Editar' }).click();
  await page.getByRole('textbox', { name: 'Título' }).fill('Postagem revisada pelo Playwright');
  await page.getByRole('button', { name: 'Salvar postagem' }).click();
  await expect(page.getByRole('link', { name: 'Postagem revisada pelo Playwright' })).toBeVisible();
  await page.getByRole('link', { name: 'Postagem revisada pelo Playwright' }).click();
  await page.getByRole('button', { name: 'Excluir' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByRole('heading', { name: 'Postagem revisada pelo Playwright' })).toBeVisible();
  await page.getByRole('button', { name: 'Excluir' }).click();
  await dialog.getByRole('button', { name: 'Excluir postagem' }).click();
  await expect(page.getByRole('link', { name: 'Postagem revisada pelo Playwright' })).toHaveCount(0);
});

test('a rota de exclusão nunca apaga um registro ao ser acessada', async ({ page }) => {
  await page.goto('/#/excluir/101');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByRole('heading', { name: 'Como organizar um calendário editorial' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Como organizar um calendário editorial' })).toBeVisible();
});

test('edição inválida informa erros e bloqueia saída com alterações pendentes', async ({ page }) => {
  await page.goto('/#/cadastro');
  await page.getByRole('button', { name: 'Salvar postagem' }).click();
  await expect(page.getByText('Informe um título para continuar.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Título' }).fill('Rascunho não salvo');
  page.once('dialog', async (dialog) => { expect(dialog.type()).toBe('confirm'); await dialog.dismiss(); });
  await page.getByRole('link', { name: 'Postagens' }).click();
  await expect(page.getByRole('heading', { name: 'Nova postagem' })).toBeVisible();
  page.once('dialog', async (dialog) => { await dialog.accept(); });
  await page.getByRole('link', { name: 'Postagens' }).click();
  await expect(page.getByRole('heading', { name: 'Postagens' })).toBeVisible();
});

test('falha local exibe recuperação sem apagar silenciosamente os dados', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('postflow:posts:v2', 'json inválido'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('dados locais estão inválidos');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'Restaurar exemplos' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Restaurar dados' }).click();
  await expect(page.getByText('12 postagens')).toBeVisible();
});

test('interface desktop sem scroll horizontal; mobile com tabela operável e sem cortes globais', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Postagens' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
  await page.screenshot({ path: 'test-results/dashboard-' + testInfo.project.name + '.png', fullPage: true });
  await page.getByRole('link', { name: 'Nova postagem' }).first().click();
  await expect(page.getByRole('button', { name: 'Salvar postagem' })).toBeVisible();
});

test('a página inicial não tem violações WCAG 2 A e AA graves ou críticas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Postagens' })).toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(audit.violations.filter((item) => ['serious','critical'].includes(item.impact))).toEqual([]);
});

test('zoom de 200% mantém controles utilizáveis no desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', '200% em desktop equivale ao breakpoint responsivo');
  await page.goto('/');
  await page.evaluate(() => { document.body.style.zoom = '200%'; });
  await expect(page.getByRole('heading', { name: 'Postagens' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nova postagem' }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});

test('diálogo de exclusão recebe foco e aceita Escape', async ({ page }) => {
  await page.goto('/#/excluir/101');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'Como organizar um calendário editorial' })).toBeVisible();
});
