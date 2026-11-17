import { useState } from 'react';
import Discover from './Discover.jsx';

export default function App() {
  const [tab, setTab] = useState('discover');
  return (
    <div className="app">
      <main className="main">{tab === 'home' ? null /* Home stays blank */ : <Discover />}</main>
      <nav className="tabs">
        <button className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')}>Home</button>
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')}>Discover</button>
      </nav>
    </div>
  );
}
