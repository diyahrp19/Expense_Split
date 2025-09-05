
import React, { useState, useEffect } from 'react';

export default function GroupList({ token, onOpen }) {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchGroups(); }, []);

  async function fetchGroups() {
    const res = await fetch('http://localhost:5000/api/groups', { headers: { Authorization: 'Bearer ' + token } });
    const data = await res.json();
    setGroups(data);
  }

  async function create(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/groups', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ name, description: desc })
    });
    const data = await res.json();
    if (res.ok) { setName(''); setDesc(''); fetchGroups(); } else setMsg(data.msg || 'Error');
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Your Groups</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
        {groups.map(g => (
          <div key={g._id} style={{ background: '#fff', border: '1px solid #e3e3e3', borderRadius: 12, padding: 22, minWidth: 240, flex: '1 1 240px', boxShadow: '0 2px 12px #e3e3e3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'box-shadow 0.2s', cursor: 'pointer', position: 'relative' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #b3c6e0'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px #e3e3e3'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 12 }}>
                {g.name ? g.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <strong style={{ fontSize: 18 }}>{g.name}</strong>
                <div style={{ color: '#555', margin: '4px 0 0 0', fontSize: 14 }}>{g.description}</div>
              </div>
            </div>
            <button style={{ alignSelf: 'flex-end', background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginTop: 10 }} onClick={() => onOpen(g)}>Open</button>
          </div>
        ))}
      </div>
      <div style={{ background: '#f8fafc', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px #eee', maxWidth: 400, margin: '0 auto' }}>
        <h3 style={{ marginBottom: 16 }}>Create Group</h3>
        {msg && <div style={{ color: 'red', marginBottom: 8 }}>{msg}</div>}
        <input style={{ marginBottom: 10 }} placeholder="Group name" value={name} onChange={e => setName(e.target.value)} />
        <input style={{ marginBottom: 10 }} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <button style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={create}>Create</button>
      </div>
    </div>
  );
}
