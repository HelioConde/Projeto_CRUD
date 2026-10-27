import { Search, X } from 'lucide-react';

export default function SearchInput({ value, onChange }) {
  return (
    <div className="search-field">
      <Search size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="post-search">Buscar postagens por título ou tag</label>
      <input id="post-search" type="search" placeholder="Buscar postagens..." value={value} onChange={(event) => onChange(event.target.value)} />
      {value && <button type="button" className="clear-search" onClick={() => onChange('')} aria-label="Limpar busca"><X size={17}/></button>}
    </div>
  );
}
