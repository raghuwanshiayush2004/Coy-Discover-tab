const j = (r) => { if (!r.ok) throw new Error(r.status); return r.json(); };
export const getFeed = () => fetch('/api/feed').then(j);
export const getMatches = () => fetch('/api/matches').then(j);
export const swipe = (profileId, direction) =>
  fetch('/api/swipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profileId, direction }) }).then(j);
export const resetDemo = () => fetch('/api/reset', { method: 'POST' }).then(j);
