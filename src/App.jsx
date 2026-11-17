import { useEffect, useMemo, useState } from 'react';
import { Search, Play, Plus, Bookmark, Film, Clapperboard, X, ExternalLink, LoaderCircle } from 'lucide-react';

const demoTitles = [
  { id: 1, title: 'The Last Horizon', name: 'The Last Horizon', media_type: 'movie', release_date: '2025-03-12', genre: 'Sci-Fi', vote_average: 8.4, overview: 'A sample title shown while the live catalogue is not connected.', poster_path: null, provider: 'Provider information unavailable' },
  { id: 2, title: 'City of Echoes', name: 'City of Echoes', media_type: 'tv', first_air_date: '2024-06-02', genre: 'Thriller', vote_average: 8.1, overview: 'A sample series shown while the live catalogue is not connected.', poster_path: null, provider: 'Provider information unavailable' },
  { id: 3, title: 'Monsoon Letters', name: 'Monsoon Letters', media_type: 'movie', release_date: '2023-08-18', genre: 'Drama', vote_average: 7.9, overview: 'A sample title shown while the live catalogue is not connected.', poster_path: null, provider: 'Provider information unavailable' },
  { id: 4, title: 'Neon District', name: 'Neon District', media_type: 'tv', first_air_date: '2025-01-11', genre: 'Action', vote_average: 8.6, overview: 'A sample series shown while the live catalogue is not connected.', poster_path: null, provider: 'Provider information unavailable' },
  { id: 5, title: 'Wild North', name: 'Wild North', media_type: 'movie', release_date: '2022-10-05', genre: 'Adventure', vote_average: 8.0, overview: 'A sample title shown while the live catalogue is not connected.', poster_path: null, provider: 'Provider information unavailable' },
  { id: 6, title: 'The Paper Kingdom', name: 'The Paper Kingdom', media_type: 'tv', first_air_date: '2024-04-20', genre: 'Fantasy', vote_average: 8.3, overview: 'A sample series shown while the live catalogue is not connected.', poster_path: null, provider: 'Provider information unavailable' }
];

const imageUrl = path => path ? `https://image.tmdb.org/t/p/w500${path}` : '';
const titleOf = item => item.title || item.name || 'Untitled';
const yearOf = item => (item.release_date || item.first_air_date || '').slice(0, 4);
const kindOf = item => item.media_type === 'tv' ? 'Series' : 'Movie';

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('evee-watchlist') || '[]'); } catch { return []; }
  });
  const [active, setActive] = useState(null);
  const [titles, setTitles] = useState(demoTitles);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerLink, setProviderLink] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('action', query.trim() ? 'search' : 'popular');
        if (query.trim()) params.set('q', query.trim());
        const response = await fetch(`/api/tmdb?${params.toString()}`);
        if (!response.ok) throw new Error('Catalogue API is not configured yet');
        const data = await response.json();
        if (!cancelled) {
          setTitles((data.results || []).filter(x => x.media_type === 'movie' || x.media_type === 'tv'));
          setLive(true);
        }
      } catch {
        if (!cancelled) { setTitles(demoTitles.filter(x => titleOf(x).toLowerCase().includes(query.toLowerCase()))); setLive(false); }
      } finally { if (!cancelled) setLoading(false); }
    };
    const timer = setTimeout(load, query.trim() ? 350 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    try { localStorage.setItem('evee-watchlist', JSON.stringify(saved)); } catch {}
  }, [saved]);

  const items = useMemo(() => titles.filter(item => filter === 'All' || (filter === 'Movies' ? item.media_type !== 'tv' : item.media_type === 'tv')), [titles, filter]);
  const toggleSaved = item => setSaved(old => old.some(x => x.id === item.id && x.media_type === item.media_type) ? old.filter(x => !(x.id === item.id && x.media_type === item.media_type)) : [...old, { id: item.id, media_type: item.media_type, title: titleOf(item) }]);
  const isSaved = item => saved.some(x => x.id === item.id && x.media_type === item.media_type);

  const openDetails = async item => {
    setActive(item); setProviders([]); setProviderLink(''); setDetailLoading(true);
    try {
      const params = new URLSearchParams({ action: 'providers', id: String(item.id), type: item.media_type || 'movie' });
      const response = await fetch(`/api/tmdb?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const region = data.results?.IN || data.results?.US;
        setProviders([...(region?.flatrate || []), ...(region?.rent || []), ...(region?.buy || [])].filter((p, i, a) => a.findIndex(x => x.provider_id === p.provider_id) === i));
        setProviderLink(region?.link || '');
      }
    } catch { /* Provider availability is optional. */ }
    finally { setDetailLoading(false); }
  };

  return <div className="app">
    <header className="header"><a className="logo" href="#top"><span className="logo-icon">E</span> EVEE <b>FLIX</b></a><nav><a href="#discover">Discover</a><a href="#discover">Movies</a><a href="#discover">Series</a><a href="#watchlist">My List ({saved.length})</a></nav><label className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies & series..."/></label></header>
    <main id="top"><section className="hero"><div><span className="eyebrow">YOUR ENTERTAINMENT, ONE PLACE</span><h1>Find your next<br/><em>favourite story.</em></h1><p>Discover movies and series, explore details and check where titles are officially available.</p><a className="button" href="#discover"><Play size={16} fill="currentColor"/> Explore titles</a><small>EVEE FLIX is a discovery app. Playback and downloads are provided only through authorized services.</small></div><div className="hero-art"><div className="orb"></div><div className="hero-card"><span>EVEE ORIGINALS</span><strong>STORIES<br/>BEYOND<br/>LIMITS</strong><small>DISCOVER SOMETHING NEW</small></div></div></section>
    <section id="discover" className="catalogue"><div className="section-head"><div><span className="eyebrow">THE EVEE COLLECTION</span><h2>{query ? 'Search results' : 'Trending now'}</h2><p>{live ? 'Live movie and series catalogue' : 'Preview catalogue — connect the API to load live titles'}</p></div><div className="filters">{['All','Movies','Series'].map(f => <button className={filter === f ? 'chosen' : ''} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div></div>
    {loading && <div className="loading"><LoaderCircle className="spin" size={18}/> Loading titles...</div>}
    {!loading && <div className="grid">{items.map(item => <article className="item" key={`${item.media_type}-${item.id}`}><button className="poster live-poster" onClick={() => openDetails(item)} style={imageUrl(item.poster_path) ? { backgroundImage: `linear-gradient(0deg,#050508 0%,#05050822 65%,#05050811),url(${imageUrl(item.poster_path)})` } : undefined}><span className="poster-top">EVEE FLIX</span><strong>{titleOf(item)}</strong><small>{yearOf(item)} · {kindOf(item)}</small><span className="poster-play"><Play fill="currentColor"/></span></button><div className="item-meta"><div><h3>{titleOf(item)}</h3><p>{kindOf(item)} · {yearOf(item) || 'Year unavailable'}</p></div><span className="rating">★ {Number(item.vote_average || 0).toFixed(1)}</span></div><button className="save" onClick={() => toggleSaved(item)}><Plus size={14}/>{isSaved(item) ? 'Saved to list' : 'Add to list'}</button></article>)}</div>}
    {!loading && items.length === 0 && <p className="empty">No titles found. Try another search.</p>}
    </section>
    <section id="watchlist" className="watchlist"><div><span className="eyebrow">YOUR PERSONAL COLLECTION</span><h2><Bookmark size={20}/> My List</h2></div>{saved.length ? <div className="saved-list">{saved.map(item => <span key={`${item.media_type}-${item.id}`}>{item.title}<button onClick={() => setSaved(old => old.filter(x => !(x.id === item.id && x.media_type === item.media_type)))} aria-label={`Remove ${item.title}`}>×</button></span>)}</div> : <p className="empty">Your list is empty. Add titles you want to remember.</p>}</section>
    </main><footer><span className="logo"><span className="logo-icon">E</span> EVEE <b>FLIX</b></span><span>Discover better. Watch legally.</span><span>© {new Date().getFullYear()} EVEE FLIX</span></footer>
    {active && <div className="overlay" onClick={() => setActive(null)}><div className="dialog" onClick={e => e.stopPropagation()}><button className="dismiss" onClick={() => setActive(null)}><X size={20}/></button><span className="eyebrow">{kindOf(active)} · {yearOf(active) || 'Release year unavailable'}</span><h2>{titleOf(active)}</h2><p>{active.overview || 'No synopsis is available.'}</p><p className="fine">Rating: {Number(active.vote_average || 0).toFixed(1)} / 10</p><h3>Where to watch</h3>{detailLoading ? <p className="fine">Checking provider availability...</p> : providers.length ? <div className="providers">{providers.map(p => <span key={p.provider_id}>{p.provider_name}</span>)}</div> : <p className="fine">No provider information returned for this region. Availability varies by country and can change.</p>}{providerLink && <a className="provider-link" href={providerLink} target="_blank" rel="noreferrer">View official provider options <ExternalLink size={14}/></a>}<button className="button" onClick={() => setActive(null)}>Close details</button></div></div>}
  </div>;
}
