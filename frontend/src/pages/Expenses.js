import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, MenuItem, Select, CircularProgress, Alert, Avatar } from '@mui/material';

export default function Expenses({ token }) {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        async function fetchExpenses() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`http://localhost:5000/api/expenses/group/${selectedGroup}`, { headers: { Authorization: 'Bearer ' + token } });
                const data = await res.json();
                setExpenses(data);
            } catch (err) {
                setError('Failed to load expenses');
            }
            setLoading(false);
        }
        fetchExpenses();
    }, [selectedGroup, token]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 400 }}>
            <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Expenses</Typography>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, mb: 2, maxWidth: 500 }}>
                <CardContent>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                        Select a group to view its expenses:
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
                            {expenses.length === 0 ? (
                                <Typography color="text.secondary">No expenses found for this group.</Typography>
                            ) : (
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
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
