import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';
import { getProducts, getOrders, getCustomers } from '../api';
import { generatePDF } from '../utils/reportUtils';
import CircularProgress from '@mui/material/CircularProgress';

export default function Reports() {
    const [loading, setLoading] = React.useState(null); // 'products', 'orders', 'customers' or null

    const handleGenerateReport = async (type, mode = 'download') => {
        setLoading(type);
        try {
            let title = "";
            let columns = [];
            let data = [];
            let filename = "";

            if (type === 'products') {
                const products = await getProducts();
                title = "Product Inventory Report";
                columns = ["ID", "Name", "Category", "Price (INR)", "Stock", "Status"];
                data = products.map(p => [p.id, p.name, p.category, p.price, p.stock, p.status]);
                filename = "products_report.pdf";
            } else if (type === 'orders') {
                const [orders, customers] = await Promise.all([getOrders(), getCustomers()]);
                title = "Order Report";
                columns = ["Order ID", "Customer", "Email", "Phone", "Location", "Amount", "Date", "Status"];
                data = orders.map(o => {
                    const customerDetails = customers.find(c => c.name === o.customer);
                    return [
                        o.id,
                        o.customer,
                        customerDetails ? customerDetails.email : 'N/A',
                        customerDetails ? customerDetails.phone : 'N/A',
                        o.location,
                        o.amount ? o.amount.toString().replace('₹', 'Rs.') : '',
                        o.date,
                        o.status
                    ];
                });
                filename = "orders_report.pdf";
            } else if (type === 'customers') {
                const customers = await getCustomers();
                title = "Customer Report";
                columns = ["ID", "Name", "Email", "Phone", "Location", "Orders", "Status"];
                data = customers.map(c => [c.id, c.name, c.email, c.phone, c.location, c.orders, c.status]);
                filename = "customers_report.pdf";
            }

            generatePDF(title, columns, data, filename, mode);

        } catch (error) {
            console.error("Report generation failed:", error);
            alert("Failed to generate report.");
        } finally {
            setLoading(null);
        }
    };

    const ReportCard = ({ title, description, type }) => (
        <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button
                        size="small"
                        startIcon={loading === type ? <CircularProgress size={20} /> : <VisibilityIcon />}
                        onClick={() => handleGenerateReport(type, 'view')}
                        disabled={!!loading}
                    >
                        View
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={loading === type ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
                        onClick={() => handleGenerateReport(type, 'download')}
                        disabled={!!loading}
                    >
                        Download
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
                    Reports Center
                </Typography>
                <Grid container spacing={3}>
                    <ReportCard
                        title="Product Inventory"
                        description="Complete list of all products, stock levels, and pricing."
                        type="products"
                    />
                    <ReportCard
                        title="Sales Orders"
                        description="Detailed log of all customer orders, status, and contact info."
                        type="orders"
                    />
                    <ReportCard
                        title="Customer Database"
                        description="Registered customers, contact details, and order history."
                        type="customers"
                    />
                </Grid>
            </Box>
        </motion.div>
    );
}
