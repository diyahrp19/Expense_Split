
import React, { useState } from 'react';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setMsg(data.msg || 'Login failed');
      }
    } catch (err) { setMsg('Network error'); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ textAlign: 'center' }}>Login</h3>
      {msg && <div style={{ color: 'red', marginBottom: 8 }}>{msg}</div>}
      <label htmlFor="login-email">Email</label>
      <input id="login-email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
      <label htmlFor="login-password">Password</label>
      <input id="login-password" placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
      <button type="submit" style={{ marginTop: 8 }}>Login</button>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        New user?{' '}
        <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={onSwitch}>Sign up</span>
      </div>
    </form>
  );
}
