import { useEffect, useRef, useState } from 'react';
import { getFeed, getMatches, swipe, resetDemo } from './api.js';

const THRESHOLD = 100;
const IDLE = { x: 0, y: 0, active: false };

function Card({ p, top, drag = IDLE, fly = 0, handlers }) {
  const x = fly ? fly * 700 : drag.x;
  const style = top
    ? { transform: `translate(${x}px, ${fly ? 0 : drag.y}px) rotate(${x / 15}deg)`, transition: drag.active ? 'none' : 'transform .3s ease' }
    : { transform: 'scale(.95) translateY(12px)', opacity: 0.7 };
  const s = top ? Math.min(Math.abs(x) / THRESHOLD, 1) : 0;
  return (
    <div className="card" style={style} {...(top ? handlers : {})}>
      <img src={p.photo} alt={p.name} draggable="false" />
      {top && <span className="stamp like" style={{ opacity: x > 0 ? s : 0 }}>LIKE</span>}
      {top && <span className="stamp nope" style={{ opacity: x < 0 ? s : 0 }}>PASS</span>}
      <div className="info">
        <h2>{p.name}, {p.age}</h2>
        <p className="loc">{p.location}</p>
        <p>{p.bio}</p>
        <div className="tags">{p.interests.map((i) => <span key={i}>{i}</span>)}</div>
      </div>
    </div>
  );
}

function Swipe() {
  const [cards, setCards] = useState(null);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(IDLE);
  const [fly, setFly] = useState(0);
  const start = useRef(null);
  const busy = useRef(false);

  const load = () => getFeed().then(setCards).catch(() => setError('Could not reach the server. Is it running on port 4000?'));
  useEffect(() => { load(); }, []);

  async function commit(dir) {
    const top = cards?.[0];
    if (!top || busy.current) return;
    busy.current = true;
    setFly(dir === 'like' ? 1 : -1);
    const req = swipe(top.id, dir).catch(() => null);
    await new Promise((r) => setTimeout(r, 300));
    const res = await req;
    setFly(0); setDrag(IDLE);
    busy.current = false;
    if (!res) return setError('Swipe failed, try again.');
    setError('');
    setCards((c) => c.filter((x) => x.id !== top.id));
    if (res.matched) setMatch(res.profile);
  }

  const handlers = {
    onPointerDown: (e) => { if (busy.current) return; start.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); setDrag({ x: 0, y: 0, active: true }); },
    onPointerMove: (e) => { if (start.current) setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true }); },
    onPointerUp: () => {
      if (!start.current) return;
      start.current = null;
      if (Math.abs(drag.x) > THRESHOLD) commit(drag.x > 0 ? 'like' : 'pass');
      else setDrag(IDLE);
    }
  };

  if (!cards) return <p className="center">{error || 'Loading…'}</p>;
  const [top, next] = cards;

  return (
    <>
      {error && <p className="error">{error}</p>}
      <div className="stack">
        {!top && (
          <div className="empty">
            <h2>You're all caught up</h2>
            <p>No more profiles for now. Check your matches or start the demo again.</p>
            <button className="primary" onClick={() => resetDemo().then(load)}>Reset demo</button>
          </div>
        )}
        {next && <Card key={next.id} p={next} top={false} />}
        {top && <Card key={top.id} p={top} top drag={drag} fly={fly} handlers={handlers} />}
      </div>
      {top && (
        <div className="actions">
          <button className="round pass" aria-label="Pass" onClick={() => commit('pass')}>✕</button>
          <button className="round like" aria-label="Like" onClick={() => commit('like')}>♥</button>
        </div>
      )}
      {match && (
        <div className="overlay">
          <h1>It's a match!</h1>
          <img src={match.photo} alt={match.name} />
          <p>You and {match.name} liked each other.</p>
          <button className="primary" onClick={() => setMatch(null)}>Keep swiping</button>
        </div>
      )}
    </>
  );
}

function Matches() {
  const [list, setList] = useState(null);
  useEffect(() => { getMatches().then(setList).catch(() => setList([])); }, []);
  if (!list) return <p className="center">Loading…</p>;
  if (!list.length) return <div className="empty"><h2>No matches yet</h2><p>A match shows up here only when you both like each other.</p></div>;
  return (
    <div className="grid">
      {list.map((p) => (
        <div className="mcard" key={p.id}>
          <img src={p.photo} alt={p.name} />
          <div><b>{p.name}, {p.age}</b><small>{p.location}</small></div>
        </div>
      ))}
    </div>
  );
}

export default function Discover() {
  const [view, setView] = useState('swipe');
  return (
    <>
      <div className="seg">
        <button className={view === 'swipe' ? 'on' : ''} onClick={() => setView('swipe')}>Swipe</button>
        <button className={view === 'matches' ? 'on' : ''} onClick={() => setView('matches')}>Matches</button>
      </div>
      {view === 'swipe' ? <Swipe /> : <Matches />}
    </>
  );
}