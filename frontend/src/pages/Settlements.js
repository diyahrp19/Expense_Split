import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, MenuItem, Select, CircularProgress, Alert, Avatar, TextField, Button } from '@mui/material';

export default function Settlements({ token }) {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [members, setMembers] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [submitMsg, setSubmitMsg] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await fetch('http://localhost:5000/api/groups', { headers: { Authorization: 'Bearer ' + token } });
                const data = await res.json();
                setGroups(data);
            } catch (err) {
                setError('Failed to load groups');
            }
        }
        fetchGroups();
    }, [token]);

    useEffect(() => {
        if (!selectedGroup) return;
        async function fetchSettlements() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`http://localhost:5000/api/settlements/group/${selectedGroup}`, { headers: { Authorization: 'Bearer ' + token } });
                const data = await res.json();
                setSettlements(data);
            } catch (err) {
                setError('Failed to load settlements');
            }
            setLoading(false);
        }
        async function fetchMembers() {
            try {
                const res = await fetch(`http://localhost:5000/api/groups/${selectedGroup}`, { headers: { Authorization: 'Bearer ' + token } });
                const data = await res.json();
                setMembers(data.members || []);
            } catch (err) {
                setMembers([]);
            }
        }
        fetchSettlements();
        fetchMembers();
    }, [selectedGroup, token]);

    async function handleSettleUp(e) {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitMsg('');
        try {
            const res = await fetch('http://localhost:5000/api/settlements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                body: JSON.stringify({ group: selectedGroup, from, to, amount: parseFloat(amount) })
            });
            const data = await res.json();
            if (res.ok) {
                setFrom(''); setTo(''); setAmount(''); setSubmitMsg('Settlement recorded!');
                // Refresh settlements
                const res2 = await fetch(`http://localhost:5000/api/settlements/group/${selectedGroup}`, { headers: { Authorization: 'Bearer ' + token } });
                setSettlements(await res2.json());
            } else {
                setSubmitMsg(data.msg || 'Error');
            }
        } catch (err) {
            setSubmitMsg('Network error');
        }
        setSubmitLoading(false);
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 400 }}>
            <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Settlements</Typography>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, mb: 2, maxWidth: 500 }}>
                <CardContent>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                        Select a group to view and record settlements:
                    </Typography>
                    <Select
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>Select group</MenuItem>
                        {groups.map(g => (
                            <MenuItem key={g._id} value={g._id}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', mr: 1, display: 'inline-flex' }}>{g.name ? g.name[0].toUpperCase() : '?'}</Avatar>
                                {g.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
                    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                    {!loading && !error && selectedGroup && (
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} mb={1}>Settlements</Typography>
                            {settlements.length === 0 ? (
                                <Typography color="text.secondary">No settlements found for this group.</Typography>
                            ) : (
                                <ul style={{ paddingLeft: 0 }}>
                                    {settlements.map(s => (
                                        <li key={s._id} style={{ marginBottom: 14, background: '#f8fafc', borderRadius: 8, padding: 10, boxShadow: '0 1px 4px #eee', listStyle: 'none' }}>
                                            <span style={{ color: '#1976d2', fontWeight: 600 }}>{s.from?.name}</span> paid <span style={{ color: '#1976d2', fontWeight: 600 }}>{s.to?.name}</span> <span style={{ fontWeight: 600 }}>${s.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Box mt={3}>
                                <Typography variant="subtitle1" fontWeight={600} mb={1}>Record a new settlement</Typography>
                                <form onSubmit={handleSettleUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <Select
                                        value={from}
                                        onChange={e => setFrom(e.target.value)}
                                        displayEmpty
                                        fullWidth
                                        sx={{ mb: 1 }}
                                        required
                                    >
                                        <MenuItem value="" disabled>From (payer)</MenuItem>
                                        {members.map(m => (
                                            <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <Select
                                        value={to}
                                        onChange={e => setTo(e.target.value)}
                                        displayEmpty
                                        fullWidth
                                        sx={{ mb: 1 }}
                                        required
                                    >
                                        <MenuItem value="" disabled>To (receiver)</MenuItem>
                                        {members.map(m => (
                                            <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <TextField
                                        label="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        required
                                        fullWidth
                                        inputProps={{ min: 0.01, step: 0.01 }}
                                    />
                                    <Button type="submit" variant="contained" color="primary" disabled={submitLoading} sx={{ mt: 1 }}>
                                        {submitLoading ? <CircularProgress size={20} /> : 'Settle Up'}
                                    </Button>
                                    {submitMsg && <Alert severity={submitMsg === 'Settlement recorded!' ? 'success' : 'error'} sx={{ mt: 2 }}>{submitMsg}</Alert>}
                                </form>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
