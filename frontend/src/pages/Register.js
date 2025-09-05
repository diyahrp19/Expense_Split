
import React, { useState } from 'react';

export default function Register({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Registered. Please login.');
      } else {
        setMsg(data.msg || 'Register failed');
      }
    } catch (err) { setMsg('Network error'); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ textAlign: 'center' }}>Sign Up</h3>
      {msg && <div style={{ color: msg.startsWith('Registered') ? 'green' : 'red', marginBottom: 8 }}>{msg}</div>}
      <label htmlFor="register-name">Name</label>
      <input id="register-name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
      <label htmlFor="register-email">Email</label>
      <input id="register-email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
      <label htmlFor="register-password">Password</label>
      <input id="register-password" placeholder="Create a password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
      <button type="submit" style={{ marginTop: 8 }}>Sign Up</button>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        Already have an account?{' '}
        <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={onSwitch}>Login</span>
      </div>
    </form>
  );
}
