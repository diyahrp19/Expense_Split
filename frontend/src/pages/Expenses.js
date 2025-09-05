import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function Expenses() {
    // TODO: Fetch and display real user expenses
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 400 }}>
            <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Expenses</Typography>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, mb: 2 }}>
                <CardContent>
                    <Typography variant="body1" color="text.secondary">
                        Your expenses will appear here. Add or view expenses by selecting a group.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
