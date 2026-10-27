import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, statusText } from '../lib/format.js';

export default function PostTable({ posts }) {
  return (
    <div className="table-scroll" role="region" tabIndex={0} aria-label="Tabela de postagens; pode rolar horizontalmente">
      <table className="post-table">
        <thead><tr><th scope="col">Conteúdo</th><th scope="col">Status</th><th scope="col">Atualizado em</th><th scope="col" className="actions-head">Ações</th></tr></thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <Link className="post-name" to={'/detalhes/' + post.id}>{post.title}</Link>
                <span className="post-tags">{post.tags || 'Sem tags'}</span>
              </td>
              <td><span className={'status-pill ' + (post.status === 'draft' ? 'status-draft' : 'status-published')}><span className="status-dot" />{statusText(post.status)}</span></td>
              <td className="date-cell">{formatDate(post.updated_at)}</td>
              <td><div className="table-actions">
                <Link className="action-btn" to={'/detalhes/' + post.id} aria-label={'Ver detalhes de ' + post.title} title="Visualizar"><Eye size={17}/></Link>
                <Link className="action-btn" to={'/editar/' + post.id} aria-label={'Editar ' + post.title} title="Editar"><Pencil size={17}/></Link>
                <Link className="action-btn danger-hover" to={'/excluir/' + post.id} aria-label={'Excluir ' + post.title} title="Excluir"><Trash2 size={17}/></Link>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
