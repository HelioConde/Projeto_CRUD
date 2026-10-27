import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { deletePost, getPost } from '../lib/postsRepository.js';
import { formatDate, statusText } from '../lib/format.js';
import { useNotify } from '../App.jsx';

export default function PostDetailsPage({ deleteRoute = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    getPost(id, { signal: controller.signal }).then((item) => { if (!item) throw new Error('Postagem não encontrada.'); setPost(item); }).catch((err) => {
      if (err.name !== 'AbortError') setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  function cancel() { if (deleteRoute) navigate('/detalhes/' + id, { replace:true }); else setConfirmOpen(false); }
  async function remove() {
    try { await deletePost(id); notify('Postagem excluída com sucesso.'); navigate('/', { replace:true }); }
    catch (err) { setError(err.message); }
  }
  return <div className="details-page">
    <div className="page-heading editor-heading"><div><Link className="back-link" to="/"><ChevronLeft size={17}/> Voltar para postagens</Link><h1>Detalhes da postagem</h1><p>Veja e gerencie as informações do conteúdo.</p></div>
      {post && <div className="detail-heading-actions"><Link className="btn btn-secondary" to={'/editar/' + id}><Pencil size={16}/> Editar</Link><button className="btn btn-danger-outline" type="button" onClick={() => setConfirmOpen(true)}><Trash2 size={16}/> Excluir</button></div>}
    </div>
    {error && <div className="inline-alert" role="alert">{error}</div>}
    {loading ? <div className="panel table-message" role="status">Carregando detalhes…</div> :
      post ? <div className="details-grid"><article className="panel details-content">
        <div className="detail-label">POSTAGEM</div><h2>{post.title}</h2>
        <div className="detail-tag-line">{post.tags || 'Sem tags'}</div>
        <div className="detail-section"><h3>Texto principal</h3><p className="detail-pre">{post.primary_text || 'Não informado.'}</p></div>
        <div className="detail-section"><h3>Texto complementar</h3><p className="detail-pre">{post.secondary_text || 'Não informado.'}</p></div>
        {post.youtube_link && <div className="detail-section"><h3>Vídeo</h3><a href={post.youtube_link} rel="noopener noreferrer" target="_blank">Abrir link do vídeo <ExternalLink size={14}/></a></div>}
      </article><aside className="panel details-side"><h2>Informações</h2>
        <dl><div><dt>Status</dt><dd><span className={'status-pill ' + (post.status === 'draft' ? 'status-draft' : 'status-published')}>{statusText(post.status)}</span></dd></div>
        <div><dt>Publicado em</dt><dd>{formatDate(post.published_at)}</dd></div>
        <div><dt>Atualizado em</dt><dd>{formatDate(post.updated_at)}</dd></div>
        <div><dt>Título SEO</dt><dd>{post.seo_title || 'Não informado'}</dd></div>
        <div><dt>Palavras-chave SEO</dt><dd>{post.seo_tags || 'Não informado'}</dd></div></dl>
      </aside></div> :
      <div className="panel table-message"><p>Postagem não encontrada.</p><Link className="btn btn-secondary" to="/">Voltar à lista</Link></div>}
    <ConfirmDialog open={!!post && (confirmOpen || deleteRoute)} title="Excluir esta postagem?" description={'A postagem “' + (post?.title || '') + '” será excluída. Esta ação não poderá ser desfeita.'} confirmLabel="Excluir postagem" onCancel={cancel} onConfirm={remove} />
  </div>;
}
