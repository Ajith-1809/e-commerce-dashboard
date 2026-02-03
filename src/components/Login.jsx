import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const token = await response.text();
                login(token);
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please check backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white'
        }}>
            <Paper component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                <Typography variant="h4" align="center" fontWeight="bold">
                    <span style={{ color: '#ea580c' }}>SHOP</span>KART
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary">
                    Admin Login
                </Typography>

                {error && <Alert severity="error" sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>{error}</Alert>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#475569' }, '&:hover fieldset': { borderColor: '#94a3b8' } } }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#475569' }, '&:hover fieldset': { borderColor: '#94a3b8' } } }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' } }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
