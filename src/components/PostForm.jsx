import { useId, useState } from 'react';
import { Eye, Save } from 'lucide-react';

const blank = { title:'', tags:'', status:'draft', youtube_link:'', primary_text:'', secondary_text:'', seo_title:'', seo_tags:'', published_at:'', featured_until:'' };
export const emptyPost = () => ({ ...blank });
export default function PostForm({ initial, onSubmit, saving, onCancel, onDirty }) {
  const [form, setForm] = useState(() => ({ ...blank, ...initial }));
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const id = useId();
  const set = (key, value) => { onDirty?.(); setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };
  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Informe um título para continuar.';
    if (form.title.length > 120) next.title = 'Use no máximo 120 caracteres.';
    if (form.youtube_link.trim()) {
      try { const url = new URL(form.youtube_link); if (!['http:', 'https:'].includes(url.protocol)) throw Error(); }
      catch { next.youtube_link = 'Informe um link válido começando com https://'; }
    }
    setErrors(next);
    return !Object.keys(next).length;
  }
  function submit(event) { event.preventDefault(); if (validate()) onSubmit({ ...form, title: form.title.trim() }); }
  return (
    <form className="editor-grid" onSubmit={submit} noValidate aria-label="Formulário da postagem">
      <div className="editor-main">
        <section className="panel form-panel" aria-labelledby={id + '-basic'}>
          <div className="section-heading"><div><h2 id={id + '-basic'}>Informações básicas</h2><p>O essencial para identificar sua postagem.</p></div></div>
          <div className="field"><label htmlFor={id + '-title'}>Título <span aria-hidden="true">*</span></label><input id={id + '-title'} name="title" value={form.title} onChange={(e) => set('title',e.target.value)} maxLength={121} aria-invalid={!!errors.title} aria-describedby={errors.title ? id + '-title-error' : undefined} placeholder="Ex.: Guia completo de planejamento" required/><div className="field-meta"><span id={id + '-title-error'} className="field-error">{errors.title}</span><span>{form.title.length}/120</span></div></div>
          <div className="field"><label htmlFor={id + '-tags'}>Tags</label><input id={id + '-tags'} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Design, Marketing, Tutorial"/><small>Separe as tags por vírgulas.</small></div>
          <div className="field"><label htmlFor={id + '-url'}>Link do YouTube <span className="optional">(opcional)</span></label><input id={id + '-url'} type="url" value={form.youtube_link} onChange={(e) => set('youtube_link', e.target.value)} aria-invalid={!!errors.youtube_link} aria-describedby={errors.youtube_link ? id + '-url-error' : undefined} placeholder="https://youtube.com/watch?v=..." /><span id={id + '-url-error'} className="field-error">{errors.youtube_link}</span></div>
        </section>
        <section className="panel form-panel" aria-labelledby={id + '-content'}>
          <div className="section-heading"><div><h2 id={id + '-content'}>Conteúdo</h2><p>Escreva o texto que será apresentado.</p></div><button className="btn btn-subtle" type="button" onClick={() => setPreview((v) => !v)} aria-pressed={preview}><Eye size={16}/>{preview ? 'Editar texto' : 'Pré-visualizar'}</button></div>
          {preview ? <article className="content-preview"><h3>{form.title || 'Título da postagem'}</h3><p>{form.primary_text || 'O texto principal aparecerá aqui.'}</p>{form.secondary_text && <p>{form.secondary_text}</p>}{form.tags && <div className="preview-tags">{form.tags}</div>}</article> :
            <><div className="field"><label htmlFor={id + '-primary'}>Texto principal</label><textarea id={id + '-primary'} rows={6} value={form.primary_text} onChange={(e) => set('primary_text', e.target.value)} placeholder="Comece a escrever sua postagem..."/></div>
            <div className="field"><label htmlFor={id + '-secondary'}>Texto complementar</label><textarea id={id + '-secondary'} rows={3} value={form.secondary_text} onChange={(e) => set('secondary_text', e.target.value)} placeholder="Informações adicionais..."/></div></>}
        </section>
        <section className="panel form-panel" aria-labelledby={id + '-seo'}>
          <div className="section-heading"><div><h2 id={id + '-seo'}>SEO</h2><p>Metadados opcionais para mecanismos de busca.</p></div></div>
          <div className="field"><label htmlFor={id + '-seo-title'}>Título SEO</label><input id={id + '-seo-title'} value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} placeholder="Título para mecanismos de busca"/></div>
          <div className="field"><label htmlFor={id + '-seo-tags'}>Palavras-chave SEO</label><input id={id + '-seo-tags'} value={form.seo_tags} onChange={(e) => set('seo_tags', e.target.value)} placeholder="exemplo, palavras, chave"/></div>
        </section>
      </div>
      <aside className="editor-aside">
        <section className="panel form-panel" aria-labelledby={id + '-publish'}>
          <h2 id={id + '-publish'}>Publicação</h2>
          <div className="field"><label htmlFor={id + '-status'}>Status</label><select id={id + '-status'} value={form.status} onChange={(e) => set('status',e.target.value)}><option value="draft">Rascunho</option><option value="published">Publicado</option></select></div>
          <p className="helper-copy">{form.status === 'draft' ? 'O conteúdo será salvo sem data de publicação.' : 'A postagem será marcada como publicada.'}</p>
          <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={saving}><Save size={16}/>{saving ? 'Salvando…' : 'Salvar postagem'}</button><button type="button" className="btn btn-secondary" disabled={saving} onClick={onCancel}>Cancelar</button></div>
        </section>
        <div className="tip-panel"><strong>Dica</strong><p>Você pode salvar como rascunho e continuar editando depois.</p></div>
      </aside>
    </form>
  );
}
