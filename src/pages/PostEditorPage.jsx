import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PostForm, { emptyPost } from '../components/PostForm.jsx';
import { getPost, savePost } from '../lib/postsRepository.js';
import { useNotify } from '../App.jsx';

export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const [post, setPost] = useState(id ? null : emptyPost());
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const allowLeave = useRef(false);
  const shouldBlock = useCallback(() => dirty && !allowLeave.current, [dirty]);
  const blocker = useBlocker(shouldBlock);
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (window.confirm('Você tem alterações não salvas. Deseja sair sem salvar?')) blocker.proceed();
    else blocker.reset();
  }, [blocker]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    getPost(id, { signal: controller.signal }).then((item) => { if (!item) throw new Error('Postagem não encontrada.'); setPost(item); }).catch((err) => {
      if (err.name !== 'AbortError') setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  async function submit(data) {
    if (saving) return;
    setSaving(true); setError('');
    try {
      await savePost(data, id);
      allowLeave.current = true;
      notify(id ? 'Postagem atualizada com sucesso.' : 'Postagem criada com sucesso.');
      navigate('/');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <div className="editor-page">
    <div className="page-heading editor-heading"><div><Link className="back-link" to="/"> <ChevronLeft size={17}/> Voltar para postagens</Link><h1>{id ? 'Editar postagem' : 'Nova postagem'}</h1><p>{id ? 'Atualize os detalhes do conteúdo.' : 'Preencha as informações para criar um novo conteúdo.'}</p></div></div>
    {error && <div className="inline-alert" role="alert">{error}</div>}
    {loading ? <div className="panel table-message" role="status">Carregando postagem…</div> :
    post ? <PostForm key={id || 'create'} initial={post} onDirty={() => setDirty(true)} onSubmit={submit} saving={saving} onCancel={() => navigate('/')}/> :
    <div className="panel table-message"><p>Não foi possível abrir a postagem.</p><Link className="btn btn-secondary" to="/">Voltar à lista</Link></div>}
  </div>;
}
