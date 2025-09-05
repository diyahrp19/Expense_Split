

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const pieData = [
    { name: 'Food', value: 400 },
    { name: 'Travel', value: 300 },
    { name: 'Shopping', value: 200 },
    { name: 'Other', value: 300 },
];
const pieColors = ['#1976d2', '#14b8a6', '#22c55e', '#f59e42'];

export default function Dashboard() {
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3" fontWeight={700} mb={2} color="primary.main" align="center">
                Welcome to SplitSmart!
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4} align="center">
                "The art is not in making money, but in keeping it."<br />
                <span style={{ fontSize: 16, color: '#1976d2' }}>– Proverb</span>
            </Typography>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, mb: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h6" fontWeight={600} mb={2} align="center">Sample Expenses by Category</Typography>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                            {pieData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
            <Typography color="text.secondary" align="center" maxWidth={400}>
                Track your expenses, see your spending breakdown, and keep your groups in sync. Start by adding a group or an expense!
            </Typography>
        </Box>
    );
}
