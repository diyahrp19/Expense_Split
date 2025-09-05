
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, CircularProgress, Alert } from '@mui/material';

export default function Profile({ token }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                    <Button variant="outlined" sx={{ mt: 2 }}>Edit Profile</Button>
                </CardContent>
            </Card>
        </Box>
    );
}
