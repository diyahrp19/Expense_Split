

import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Fab, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, Tooltip, Chip, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';

export default function GroupList({ token, onOpen }) {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchGroups(); }, []);

  async function fetchGroups() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/groups', { headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      setMsg('Failed to load groups');
    }
    setLoading(false);
  }

  async function create(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/groups', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ name, description: desc })
      });
      const data = await res.json();
      if (res.ok) {
        setName(''); setDesc(''); setOpen(false); fetchGroups();
      } else setMsg(data.msg || 'Error');
    } catch (err) { setMsg('Network error'); }
    setLoading(false);
  }

  return (
    <Box sx={{ position: 'relative', minHeight: 400 }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Your Groups</Typography>
      {msg && <Alert severity="error" sx={{ mb: 2 }}>{msg}</Alert>}
      <Grid container spacing={3} mb={6}>
        {groups.map(g => (
          <Grid item xs={12} sm={6} md={4} key={g._id}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }} onClick={() => onOpen(g)}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    {g.name ? g.name[0].toUpperCase() : <GroupIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>{g.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{g.description}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Chip icon={<GroupIcon />} label={`${g.members?.length || 0} members`} size="small" />
                  {/* Add more group stats here if needed */}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Floating Action Button for Create Group */}
      <Tooltip title="Create Group">
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: { xs: 24, md: 40 }, right: { xs: 24, md: 40 }, zIndex: 1000 }} onClick={() => setOpen(true)}>
          <AddIcon />
        </Fab>
      </Tooltip>
      {/* Create Group Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={create} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Group Name" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            <TextField label="Description" value={desc} onChange={e => setDesc(e.target.value)} />
            {msg && <Alert severity="error">{msg}</Alert>}
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
