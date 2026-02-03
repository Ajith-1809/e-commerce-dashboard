import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import { generatePreviewPDF } from '../utils/reportUtils';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Settings() {
    const [settings, setSettings] = React.useState({
        storeName: 'My E-Commerce Store',
        address: '123 Market Street, Digital City',
        email: 'contact@store.com',
        phone: '+1 234 567 890',
        footerText: 'Thank you for your business!',
        // New Settings
        gstin: '',
        taxRate: '18',
        currencySymbol: '₹',
        selectedTemplate: 'standard'
    });
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    const templates = [
        { id: 'standard', name: 'Standard Default' },
        { id: 'indian_gst', name: 'Indian GST (B2B/B2C)' },
        { id: 'corporate_blue', name: 'Corporate Blue' },
        { id: 'modern_dark', name: 'Modern Dark' },
        { id: 'minimalist', name: 'Minimalist Type' },
        { id: 'pro_orange', name: 'Professional Orange' },
        { id: 'classic_red', name: 'Classic Red (Bahi Khata)' },
        { id: 'compact', name: 'Compact List' },
        { id: 'tech', name: 'Tech Startup' },
        { id: 'elegant', name: 'Elegant Serif' }
    ];

    React.useEffect(() => {
        const saved = localStorage.getItem('storeSettings');
        if (saved) {
            setSettings({ ...settings, ...JSON.parse(saved) });
        }
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        localStorage.setItem('storeSettings', JSON.stringify(settings));
        setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const darkInputStyle = {
        '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
        },
        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#90caf9' },
        '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', mb: 4, color: '#fff' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#90caf9' }}>
                    Store Configuration
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Basic details for your store branding.
                </Typography>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField label="Store Name" name="storeName" value={settings.storeName} onChange={handleChange} fullWidth sx={darkInputStyle} />
                    <TextField label="Address" name="address" value={settings.address} onChange={handleChange} fullWidth multiline rows={2} sx={darkInputStyle} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Contact Email" name="email" value={settings.email} onChange={handleChange} fullWidth sx={darkInputStyle} />
                        <TextField label="Phone Number" name="phone" value={settings.phone} onChange={handleChange} fullWidth sx={darkInputStyle} />
                    </Box>
                    <TextField label="Report Footer Text" name="footerText" value={settings.footerText} onChange={handleChange} fullWidth helperText="Appears at the bottom of every page." sx={darkInputStyle} />

                    <Typography variant="h6" sx={{ mt: 2, color: '#90caf9', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                        Printing & Tax Settings
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="GSTIN / Tax ID" name="gstin" value={settings.gstin} onChange={handleChange} fullWidth sx={darkInputStyle} />
                        <TextField label="Default Tax Rate (%)" name="taxRate" type="number" value={settings.taxRate} onChange={handleChange} fullWidth sx={darkInputStyle} />
                        <TextField
                            select
                            label="Currency"
                            name="currencySymbol"
                            value={settings.currencySymbol}
                            onChange={handleChange}
                            sx={{ width: 150, ...darkInputStyle }}
                            SelectProps={{ native: true }}
                        >
                            <option value="₹" style={{ color: '#000' }}>₹ (INR)</option>
                            <option value="$" style={{ color: '#000' }}>$ (USD)</option>
                            <option value="€" style={{ color: '#000' }}>€ (EUR)</option>
                            <option value="£" style={{ color: '#000' }}>£ (GBP)</option>
                            <option value="¥" style={{ color: '#000' }}>¥ (JPY)</option>
                        </TextField>
                    </Box>

                    <Typography variant="h6" sx={{ mt: 2, color: '#90caf9', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                        Select Bill Template
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
                        {templates.map((t) => (
                            <Paper
                                key={t.id}
                                onClick={() => setSettings({ ...settings, selectedTemplate: t.id })}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    border: settings.selectedTemplate === t.id ? '2px solid #90caf9' : '1px solid rgba(255, 255, 255, 0.1)',
                                    bgcolor: settings.selectedTemplate === t.id ? 'rgba(144, 202, 249, 0.16)' : 'rgba(0, 0, 0, 0.2)',
                                    color: '#fff',
                                    transition: 'all 0.2s',
                                    textAlign: 'center',
                                    position: 'relative',
                                    '&:hover': { transform: 'translateY(-2px)', bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>{t.name}</Typography>
                                <Button
                                    size="small"
                                    startIcon={<VisibilityIcon fontSize="small" />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        generatePreviewPDF(t.id, settings);
                                    }}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        '&:hover': { color: '#fff', borderColor: '#fff' }
                                    }}
                                    variant="outlined"
                                >
                                    Preview
                                </Button>
                            </Paper>
                        ))}
                    </Box>

                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} size="large" sx={{ alignSelf: 'flex-start', mt: 3 }}>
                        Save All Settings
                    </Button>
                </Box>

                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </motion.div>
    );
}
