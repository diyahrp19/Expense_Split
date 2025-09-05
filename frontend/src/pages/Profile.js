
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';


export default function Profile({ token }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: 'Bearer ' + token }
                });
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError('Could not load profile.');
            }
            setLoading(false);
        }
        fetchProfile();
    }, [token]);

    const handleEditOpen = () => {
        setEditName(user?.name || '');
        setEditEmail(user?.email || '');
        setEditError('');
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleEditSave = async () => {
        setEditLoading(true);
        setEditError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({ name: editName, email: editEmail })
            });
            if (!res.ok) throw new Error('Failed to update profile');
            const data = await res.json();
            setUser(data);
            setEditOpen(false);
        } catch (err) {
            setEditError('Could not update profile.');
        }
        setEditLoading(false);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 400 }}>
            <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Profile</Typography>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, mb: 2, maxWidth: 400 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mb: 2 }}>
                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </Avatar>
                    <Typography variant="h6">{user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleEditOpen}>Edit Profile</Button>
                </CardContent>
            </Card>
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    <TextField
                        margin="normal"
                        label="Name"
                        fullWidth
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="Email"
                        fullWidth
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                    />
                    {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} disabled={editLoading}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained" disabled={editLoading}>
                        {editLoading ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
