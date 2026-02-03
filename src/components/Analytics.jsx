import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { getAnalyticsData } from '../api';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAnalyticsData();
            setData(result);
            setLoading(false);
        };
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!data) return <Typography color="error">Failed to load analytics data.</Typography>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>Analytics Dashboard</Typography>
            <Grid container spacing={3}>
                {/* Revenue vs Expenses */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)', color: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Revenue vs Expenses</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" />
                                <Bar dataKey="expenses" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Sales by Category */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)', color: 'white', height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Sales by Category</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Trend Line */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)', color: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Sales Trend (Last 6 Months)</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data.salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </motion.div>
    );
};

export default Analytics;
