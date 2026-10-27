import { useState } from 'react';
import { createHashRouter, NavLink, Outlet, Link, useOutletContext } from 'react-router-dom';
import { BookOpenText, CircleHelp, LayoutDashboard, Plus, RotateCcw, X } from 'lucide-react';
import { isDemo } from './lib/postsRepository.js';
import PostsPage from './pages/PostsPage.jsx';
import PostEditorPage from './pages/PostEditorPage.jsx';
import PostDetailsPage from './pages/PostDetailsPage.jsx';

function Shell() {
  const [notice, setNotice] = useState(null);
  function notify(message, type = 'success') { setNotice({ message, type }); }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true"><BookOpenText size={22} /></span>
          <span>Post<span className="brand-accent">Flow</span><small>CONTENT STUDIO</small></span>
        </Link>
        <nav aria-label="Navegação principal" className="nav-links">
          <NavLink to="/" end className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}><LayoutDashboard size={17}/> Postagens</NavLink>
          <NavLink to="/cadastro" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}><Plus size={17}/> Nova postagem</NavLink>
        </nav>
        <span className="mode-badge" title={isDemo ? 'Os dados ficam salvos apenas neste navegador' : 'Backend integrado'}>
          <span className="mode-dot" /><span className="mode-label-full">{isDemo ? 'Modo demonstração' : 'API conectada'}</span><span className="mode-label-short">{isDemo ? 'Demo' : 'API'}</span>
        </span>
      </header>
      <main id="conteudo" className="main-container">
        <Outlet context={{ notify }} />
      </main>
      <footer className="site-footer">
        <span>PostFlow · Projeto CRUD modernizado</span>
        <span><CircleHelp size={14} aria-hidden="true" /> {isDemo ? 'Dados armazenados neste navegador' : 'Consulte as permissões do seu servidor'}</span>
      </footer>
      {notice && (
        <div className={'toast ' + (notice.type === 'error' ? 'toast-error' : '')} role={notice.type === 'error' ? 'alert' : 'status'}>
          <span>{notice.message}</span>
          <button type="button" className="icon-button" aria-label="Fechar notificação" onClick={() => setNotice(null)}><X size={16}/></button>
        </div>
      )}
    </div>
  );
}
function NotFound() {
  return <section className="empty-page"><RotateCcw size={36} aria-hidden="true"/><h1>Página não encontrada</h1><p>Verifique o endereço ou volte para a lista.</p><Link className="btn btn-primary" to="/">Voltar para postagens</Link></section>;
}
export const useNotify = () => useOutletContext().notify;
export const router = createHashRouter([
  { path: '/', element: <Shell />, children: [
    { index: true, element: <PostsPage /> },
    { path: 'cadastro', element: <PostEditorPage /> },
    { path: 'editar/:id', element: <PostEditorPage /> },
    { path: 'detalhes/:id', element: <PostDetailsPage /> },
    { path: 'excluir/:id', element: <PostDetailsPage deleteRoute /> },
    { path: '*', element: <NotFound /> }
  ] }
]);
