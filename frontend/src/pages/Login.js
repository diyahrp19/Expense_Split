

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Link, Paper } from '@mui/material';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState(''); // No default value
  const [password, setPassword] = useState(''); // No default value
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
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
    setLoading(false);
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        {msg && <Alert severity="error">{msg}</Alert>}
        <TextField
          id="login-email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <TextField
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Typography align="center" sx={{ mt: 1 }}>
          New user?{' '}
          <Link component="button" type="button" onClick={onSwitch} sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
