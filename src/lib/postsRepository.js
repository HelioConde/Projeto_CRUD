import { initialPosts } from '../demo/posts.js';

const STORAGE_KEY = 'postflow:posts:v2';
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const isDemo = !BASE;

const cleanPost = (post) => ({
  id: String(post.id),
  title: String(post.title || ''),
  tags: Array.isArray(post.tags) ? post.tags.join(', ') : String(post.tags || ''),
  status: post.status === 'draft' ? 'draft' : 'published',
  published_at: post.published_at || '',
  updated_at: post.updated_at || '',
  featured_until: post.featured_until || '',
  youtube_link: post.youtube_link || '',
  primary_text: post.primary_text || '',
  secondary_text: post.secondary_text || '',
  seo_title: post.seo_title || '',
  seo_tags: post.seo_tags || ''
});

function readDemo() {
  let raw;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { throw new Error('O armazenamento local está indisponível. Verifique as permissões do navegador.'); }
  if (raw === null) return initialPosts.map(cleanPost);
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw Error();
    return parsed.map(cleanPost);
  } catch {
    throw new Error('Os dados locais estão inválidos. Faça uma cópia antes de redefinir a demonstração.');
  }
}

function writeDemo(posts) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
  catch { throw new Error('Não foi possível salvar os dados neste navegador. Verifique espaço e permissões.'); }
}

function validateBackend() {
  const url = new URL(BASE, window.location.origin);
  if (url.origin !== window.location.origin) throw new Error('Por segurança, a API deve utilizar a mesma origem da aplicação.');
  return url.href.replace(/\/$/, '');
}

async function request(path, options = {}) {
  const url = validateBackend() + path;
  let response;
  try {
    response = await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) }, ...options });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
  }
  if (!response.ok) {
    if (response.status === 401) throw new Error('Sua sessão expirou. Faça login novamente.');
    if (response.status === 403) throw new Error('Você não tem permissão para esta operação.');
    if (response.status === 404) throw new Error('Postagem não encontrada.');
    throw new Error('Falha na API (HTTP ' + response.status + '). Tente novamente.');
  }
  if (response.status === 204) return null;
  const payload = await response.json();
  return payload?.data ?? payload;
}

function ensureActive(signal) {
  if (signal?.aborted) throw new DOMException('Operação cancelada', 'AbortError');
}

export async function listPosts({ signal } = {}) {
  ensureActive(signal);
  if (isDemo) return readDemo();
  const posts = await request('/posts', { signal });
  if (!Array.isArray(posts)) throw new Error('A API devolveu uma lista de postagens inválida.');
  return posts.map(cleanPost);
}

export async function getPost(id, { signal } = {}) {
  ensureActive(signal);
  if (isDemo) return readDemo().find((post) => post.id === String(id)) || null;
  const post = await request('/posts/' + encodeURIComponent(id), { signal });
  return post ? cleanPost(post) : null;
}

export async function savePost(data, id = null) {
  const now = new Date().toISOString();
  const post = cleanPost({ ...data, id: id || (globalThis.crypto?.randomUUID?.() || String(Date.now())), updated_at: now, published_at: data.status === 'published' ? (data.published_at || now) : '' });
  if (isDemo) {
    const posts = readDemo();
    if (id && !posts.some((item) => item.id === String(id))) throw new Error('Postagem não encontrada.');
    writeDemo(id ? posts.map((item) => item.id === String(id) ? post : item) : [post, ...posts]);
    return post;
  }
  const result = await request(id ? '/posts/' + encodeURIComponent(id) : '/posts', { method: id ? 'PUT' : 'POST', body: JSON.stringify(post) });
  return result ? cleanPost(result) : post;
}

export async function deletePost(id) {
  if (isDemo) {
    const posts = readDemo();
    if (!posts.some((post) => post.id === String(id))) throw new Error('Postagem não encontrada.');
    writeDemo(posts.filter((post) => post.id !== String(id)));
    return;
  }
  await request('/posts/' + encodeURIComponent(id), { method: 'DELETE' });
}

export function resetDemo() {
  if (!isDemo) return;
  writeDemo(initialPosts.map(cleanPost));
}
