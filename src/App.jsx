import { useMemo, useState } from 'react';
import { Search, Play, Plus, Film, Bookmark, Clapperboard } from 'lucide-react';

const catalogue = [
  { id: 1, title: 'The Last Horizon', kind: 'Movie', year: 2025, genre: 'Sci-Fi', provider: 'Prime Video', color: 'purple', rating: '8.4' },
  { id: 2, title: 'City of Echoes', kind: 'Series', year: 2024, genre: 'Thriller', provider: 'Netflix', color: 'blue', rating: '8.1' },
  { id: 3, title: 'Monsoon Letters', kind: 'Movie', year: 2023, genre: 'Drama', provider: 'JioHotstar', color: 'gold', rating: '7.9' },
  { id: 4, title: 'Neon District', kind: 'Series', year: 2025, genre: 'Action', provider: 'Sony LIV', color: 'pink', rating: '8.6' },
  { id: 5, title: 'Wild North', kind: 'Movie', year: 2022, genre: 'Adventure', provider: 'YouTube Movies', color: 'green', rating: '8.0' },
  { id: 6, title: 'The Paper Kingdom', kind: 'Series', year: 2024, genre: 'Fantasy', provider: 'JioHotstar', color: 'red', rating: '8.3' }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [saved, setSaved] = useState([]);
  const [active, setActive] = useState(null);
  const items = useMemo(() => catalogue.filter(item => (filter === 'All' || item.kind === filter) && `${item.title} ${item.genre} ${item.provider}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  const toggleSaved = id => setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);

  return <div className="app">
    <header className="header"><a className="logo" href="#top"><span className="logo-icon">E</span> EVEE <b>FLIX</b></a><nav><a href="#discover">Discover</a><a href="#discover">Movies</a><a href="#discover">Series</a></nav><label className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search titles..."/></label></header>
    <main id="top"><section className="hero"><div><span className="eyebrow">YOUR ENTERTAINMENT, ONE PLACE</span><h1>Find your next<br/><em>favourite story.</em></h1><p>Explore movies and series across your streaming services, all from one simple discovery hub.</p><a className="button" href="#discover"><Play size={16} fill="currentColor"/> Explore titles</a><small>EVEE FLIX helps you discover titles. Playback availability depends on each official provider.</small></div><div className="hero-art"><div className="orb"></div><div className="hero-card"><span>EVEE ORIGINALS</span><strong>STORIES<br/>BEYOND<br/>LIMITS</strong><small>DISCOVER SOMETHING NEW</small></div></div></section>
    <section id="discover" className="catalogue"><div className="section-head"><div><span className="eyebrow">THE EVEE COLLECTION</span><h2>Explore titles</h2><p>Pick something worth pressing play for.</p></div><div className="filters">{['All','Movie','Series'].map(f => <button className={filter === f ? 'chosen' : ''} onClick={() => setFilter(f)} key={f}>{f === 'Movie' ? 'Movies' : f === 'Series' ? 'Series' : f}</button>)}</div></div>
    <div className="grid">{items.map(item => <article className="item" key={item.id}><button className={`poster ${item.color}`} onClick={() => setActive(item)}><span className="poster-top">EVEE FLIX</span><strong>{item.title}</strong><small>{item.year} · {item.genre}</small><span className="poster-play"><Play fill="currentColor"/></span></button><div className="item-meta"><div><h3>{item.title}</h3><p>{item.kind} · {item.provider}</p></div><span className="rating">★ {item.rating}</span></div><button className="save" onClick={() => toggleSaved(item.id)}><Plus size={14}/>{saved.includes(item.id) ? 'Saved to list' : 'Add to list'}</button></article>)}</div>
    {items.length === 0 && <p className="empty">No titles match that search.</p>}
    </section></main><footer><span className="logo"><span className="logo-icon">E</span> EVEE <b>FLIX</b></span><span>Discover better. Watch legally.</span><span>© {new Date().getFullYear()} EVEE FLIX</span></footer>
    {active && <div className="overlay" onClick={() => setActive(null)}><div className="dialog" onClick={e => e.stopPropagation()}><button className="dismiss" onClick={() => setActive(null)}>×</button><span className="eyebrow">{active.kind} · {active.year}</span><h2>{active.title}</h2><p>Listed provider: <b>{active.provider}</b></p><p className="fine">Check the provider's official app or website for current regional availability and playback options.</p><button className="button" onClick={() => setActive(null)}>Close details</button></div></div>}
  </div>;
}
