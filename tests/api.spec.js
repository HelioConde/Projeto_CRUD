import { test, expect } from '@playwright/test';

// O servidor Vite é inicializado com VITE_API_BASE_URL=/api no job do CI.
// No modo demo padrão, estes cenários de integração são ignorados.
test.skip(!process.env.VITE_API_BASE_URL, 'Executar com VITE_API_BASE_URL=/api');

const record = { id:'101', title:'Postagem disponibilizada pela API', tags:'Integração', status:'published', updated_at:'2026-10-20T12:00:00Z', published_at:'2026-10-19T12:00:00Z', primary_text:'Conteúdo retornado pelo servidor.' };

test('resposta HTTP 500 exibe erro e a tentativa novamente recupera a listagem', async ({ page }) => {
  let fail = true;
  await page.route('**/api/posts', async (route) => {
    await route.fulfill({ status:fail ? 500 : 200, contentType:'application/json', body:JSON.stringify(fail ? { message:'Falha interna' } : { data:[record] }) });
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('HTTP 500');
  fail = false;
  await page.getByRole('button', { name:'Tentar novamente' }).click();
  await expect(page.getByRole('link', { name:record.title })).toBeVisible();
});

test('falha de conexão exibe mensagem acessível', async ({ page }) => {
  await page.route('**/api/posts', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível conectar ao servidor');
});

test('a API só recebe DELETE depois da confirmação, e HTTP 403 não é tratado como sucesso', async ({ page }) => {
  let deleted = 0;
  await page.route('**/api/posts/101', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleted++;
      await route.fulfill({ status:403, contentType:'application/json', body:'{}' });
    } else {
      await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ data:record }) });
    }
  });
  await page.goto('/#/excluir/101');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(deleted).toBe(0);
  await dialog.getByRole('button', { name:'Excluir postagem' }).click();
  await expect(page.getByRole('alert')).toContainText('Você não tem permissão');
  expect(deleted).toBe(1);
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name:'Cancelar' }).click();
  await expect(page.getByRole('heading', { name:record.title })).toBeVisible();
});
