
import React, { useState, useEffect } from 'react';

export default function GroupDetails({ token, group, onBack }) {
  const [details, setDetails] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [payer, setPayer] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { if (group) load(); }, [group]);

  async function load() {
    const res = await fetch(`http://localhost:5000/api/groups/${group._id}`, { headers: { Authorization: 'Bearer ' + token } });
    const data = await res.json();
    setDetails(data);
    if (res.ok) fetchExpenses();
  }

  async function fetchExpenses() {
    const res = await fetch(`http://localhost:5000/api/expenses/group/${group._id}`, { headers: { Authorization: 'Bearer ' + token } });
    const data = await res.json();
    setExpenses(data);
  }

  function equalSplits() {
    if (!details) return [];
    const share = parseFloat(amount || 0) / details.members.length;
    return details.members.map(m => ({ user: m._id, share }));
  }

  async function addExpense(e) {
    e.preventDefault();
    const splits = equalSplits();
    const res = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ groupId: group._id, description: desc, amount: parseFloat(amount), payer: payer || details.members[0]._id, splits, category })
    });
    const data = await res.json();
    if (res.ok) { setDesc(''); setAmount(''); fetchExpenses(); } else setMsg(data.msg || 'Error');
  }

  return (
    <div>
      <button style={{ marginBottom: 18, background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }} onClick={onBack}>Back to groups</button>
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px #e3e3e3', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, marginRight: 16 }}>
            {group.name ? group.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{group.name}</h2>
            <div style={{ color: '#555', marginBottom: 4 }}>{group.description}</div>
          </div>
        </div>
        <h3 style={{ marginTop: 18 }}>Members</h3>
        <ul style={{ paddingLeft: 18, marginBottom: 0, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {group.members.map(m => (
            <li key={m._id} style={{ background: '#f4f6f8', borderRadius: 6, padding: '6px 12px', fontSize: 15, listStyle: 'none', boxShadow: '0 1px 2px #eee' }}>
              <span style={{ fontWeight: 600 }}>{m.name}</span> <span style={{ color: '#888', fontSize: 13 }}>({m.email})</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px #e3e3e3', marginBottom: 28 }}>
        <h3 style={{ marginTop: 0 }}>Expenses</h3>
        <ul style={{ paddingLeft: 0 }}>
          {expenses.map(ex => (
            <li key={ex._id} style={{ marginBottom: 18, background: '#f8fafc', borderRadius: 8, padding: 14, boxShadow: '0 1px 4px #eee', listStyle: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, marginRight: 10 }}>
                  {ex.description ? ex.description[0].toUpperCase() : '?'}
                </div>
                <strong style={{ fontSize: 16 }}>{ex.description}</strong>
                <span style={{ color: '#1976d2', marginLeft: 10, fontWeight: 600 }}>{ex.amount}</span>
                <span style={{ marginLeft: 10, color: '#555' }}>paid by <span style={{ color: '#1976d2', fontWeight: 600 }}>{ex.payer?.name}</span></span>
              </div>
              <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                {ex.splits.map(s => <li key={s.user._id}>{s.user.name}: {s.share}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ background: '#f8fafc', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px #eee', maxWidth: 400, margin: '0 auto' }}>
        <h3 style={{ marginTop: 0 }}>Add expense (equal split)</h3>
        {msg && <div style={{ color: 'red', marginBottom: 8 }}>{msg}</div>}
        <input style={{ marginBottom: 10 }} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input style={{ marginBottom: 10 }} placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <select style={{ marginBottom: 10 }} value={payer} onChange={e => setPayer(e.target.value)}>
          <option value=''>Select payer</option>
          {group.members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <input style={{ marginBottom: 10 }} placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <button style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={addExpense}>Add Expense</button>
      </div>
    </div>
  );
}
