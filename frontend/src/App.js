
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupList from './pages/GroupList';
import GroupDetails from './pages/GroupDetails';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tab, setTab] = useState('login');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  // Show login/register tabs if not logged in
  if (!token) {
    return (
      <div className="container" style={{ maxWidth: 400, margin: '40px auto', padding: 32 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32 }}>SplitSmart</h1>
        <div style={{ display: 'flex', marginBottom: 24, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #eee' }}>
          <button style={{ flex: 1, background: tab === 'login' ? '#1976d2' : '#e3e3e3', color: tab === 'login' ? 'white' : 'black', border: 'none', padding: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setTab('login')}>Login</button>
          <button style={{ flex: 1, background: tab === 'register' ? '#1976d2' : '#e3e3e3', color: tab === 'register' ? 'white' : 'black', border: 'none', padding: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setTab('register')}>Register</button>
        </div>
        <div style={{ background: '#fafbfc', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px #eee' }}>
          {tab === 'login' ? (
            <Login onLogin={(t) => { localStorage.setItem('token', t); setToken(t); }} onSwitch={() => setTab('register')} />
          ) : (
            <Register onSwitch={() => setTab('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1976d2', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', boxShadow: '2px 0 8px #e3e3e3' }}>
        <h2 style={{ margin: 0, marginBottom: 32, fontWeight: 700, letterSpacing: 1 }}>SplitSmart</h2>
        <button style={{ background: 'white', color: '#1976d2', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }} onClick={() => setView('groups')}>Groups</button>
        <button style={{ background: 'white', color: '#1976d2', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }} onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Logout</button>
      </aside>
      {/* Main content */}
      <main style={{ flex: 1, padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 700, background: 'white', borderRadius: 10, boxShadow: '0 2px 12px #e3e3e3', padding: 32, minHeight: 500 }}>
          {view === 'groups' && <GroupList token={token} onOpen={(g) => { setSelectedGroup(g); setView('group'); }} />}
          {view === 'group' && <GroupDetails token={token} group={selectedGroup} onBack={() => setView('groups')} />}
        </div>
      </main>
    </div>
  );
}
