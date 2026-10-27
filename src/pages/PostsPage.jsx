import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownUp, FilePenLine, FileText, Plus, RefreshCw, RotateCcw } from 'lucide-react';
import SearchInput from '../components/SearchInput.jsx';
import PostTable from '../components/PostTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { isDemo, listPosts, resetDemo } from '../lib/postsRepository.js';
import { useNotify } from '../App.jsx';

const PAGE_SIZE = 8;
export default function PostsPage() {
  const notify = useNotify();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [resetOpen, setResetOpen] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    listPosts({ signal: controller.signal }).then((items) => { setPosts(items); setError(''); }).catch((err) => {
      if (err.name !== 'AbortError') setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('pt-BR');
    return posts.filter((post) => (status === 'all' || post.status === status) &&
      (!needle || (post.title + ' ' + post.tags).toLocaleLowerCase('pt-BR').includes(needle)))
      .sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title, 'pt-BR') : new Date(b.updated_at) - new Date(a.updated_at));
  }, [posts, query, status, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  function refresh() { setLoading(true); setError(''); setRevision((v) => v + 1); }
  function updateQuery(value) { setQuery(value); setPage(1); }
  function updateStatus(value) { setStatus(value); setPage(1); }
  async function restore() {
    try { resetDemo(); setResetOpen(false); refresh(); notify('Dados de exemplo restaurados.'); }
    catch (err) { notify(err.message, 'error'); setResetOpen(false); }
  }
  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div><span className="eyebrow">GERENCIAMENTO DE CONTEÚDO</span><h1>Postagens</h1><p>Crie, organize e acompanhe suas publicações em um só lugar.</p></div>
        <Link className="btn btn-primary new-button" to="/cadastro"><Plus size={18}/> Nova postagem</Link>
      </div>
      <div className="stats-grid" aria-label="Resumo das postagens">
        <div className="stat-card"><span className="stat-icon indigo"><FileText size={20}/></span><div><span className="stat-label">Total de postagens</span><strong>{loading ? '—' : posts.length}</strong></div></div>
        <div className="stat-card"><span className="stat-icon green"><FileText size={20}/></span><div><span className="stat-label">Publicadas</span><strong>{loading ? '—' : posts.filter(p => p.status === 'published').length}</strong></div></div>
        <div className="stat-card"><span className="stat-icon amber"><FilePenLine size={20}/></span><div><span className="stat-label">Rascunhos</span><strong>{loading ? '—' : posts.filter(p => p.status === 'draft').length}</strong></div></div>
      </div>
      <section className="panel list-panel" aria-labelledby="all-posts">
        <div className="list-panel-head"><div><h2 id="all-posts">Todas as postagens</h2><p>Gerencie seus conteúdos e acompanhe o status.</p></div>
          <div className="list-head-actions"><button className="btn btn-subtle" type="button" onClick={refresh} disabled={loading} aria-label="Atualizar postagens"><RefreshCw size={16}/> Atualizar</button>
          {isDemo && <button className="btn btn-subtle" type="button" onClick={() => setResetOpen(true)}><RotateCcw size={16}/> Restaurar exemplos</button>}</div>
        </div>
        <div className="toolbar"><SearchInput value={query} onChange={updateQuery}/>
          <div className="toolbar-filters">
            <label className="sr-only" htmlFor="status-filter">Filtrar pelo status</label>
            <select id="status-filter" value={status} onChange={(e) => updateStatus(e.target.value)}><option value="all">Todos os status</option><option value="published">Publicados</option><option value="draft">Rascunhos</option></select>
            <label className="sr-only" htmlFor="sort-posts">Ordenar postagens</label>
            <div className="sort-select"><ArrowDownUp size={16} aria-hidden="true"/><select id="sort-posts" value={sort} onChange={(e) => {setSort(e.target.value); setPage(1);}}><option value="recent">Mais recentes</option><option value="title">Título (A–Z)</option></select></div>
          </div>
        </div>
        {loading ? <div className="table-message" role="status">Carregando postagens…</div> :
          error ? <div className="table-message" role="alert"><strong>Não foi possível carregar as postagens.</strong><p>{error}</p><button type="button" className="btn btn-secondary" onClick={refresh}>Tentar novamente</button></div> :
          !filtered.length ? <div className="table-message"><FileText size={34} aria-hidden="true"/><strong>Nenhuma postagem encontrada</strong><p>{posts.length ? 'Experimente outro termo ou filtro.' : 'Crie sua primeira postagem para começar.'}</p><div className="empty-actions">{posts.length ? <button type="button" className="btn btn-secondary" onClick={() => { updateQuery(''); updateStatus('all'); }}>Limpar filtros</button> : <Link className="btn btn-primary" to="/cadastro">Criar postagem</Link>}</div></div> :
          <PostTable posts={shown} />}
        <div className="pagination"><span>{!loading && !error ? (filtered.length ? ((currentPage - 1) * PAGE_SIZE + 1) + '–' + Math.min(currentPage * PAGE_SIZE, filtered.length) + ' de ' + filtered.length + ' postagens' : '0 postagens') : '—'}</span>
          {!loading && !error && filtered.length > 0 && <nav aria-label="Paginação de postagens" className="pagination-buttons">
            <button className="page-btn" type="button" disabled={currentPage === 1} onClick={() => setPage(v => Math.max(v - 1,1))}>Anterior</button>
            <span aria-live="polite">Página {currentPage} de {totalPages}</span>
            <button className="page-btn" type="button" disabled={currentPage === totalPages} onClick={() => setPage(v => Math.min(v + 1,totalPages))}>Próxima</button>
          </nav>}
        </div>
      </section>
      <ConfirmDialog open={resetOpen} title="Restaurar dados de exemplo?" description="As alterações feitas no modo demonstração serão substituídas pelos exemplos originais." confirmLabel="Restaurar dados" onCancel={() => setResetOpen(false)} onConfirm={restore}/>
    </div>
  );
}
