import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { alpha } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import { getOrders, createOrder, deleteOrder, updateOrder, getCustomers } from '../api';
import { motion } from 'framer-motion';

import { generatePDF, generateDetailPDF } from '../utils/reportUtils';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Orders() {
    const [orders, setOrders] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);

    // View Dialog State
    const [openViewDialog, setOpenViewDialog] = React.useState(false);
    const [viewOrder, setViewOrder] = React.useState(null);

    const [currentOrder, setCurrentOrder] = React.useState({ customer: '', location: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    const [isEdit, setIsEdit] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = React.useState(true);
    // Currency
    const [currency, setCurrency] = React.useState('₹');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const loadData = async () => {
        setLoading(true);
        const [ordersData, customersData] = await Promise.all([getOrders(), getCustomers()]);
        setOrders(ordersData);
        setCustomers(customersData);
        setLoading(false);
    };

    React.useEffect(() => {
        loadData();
        const settings = JSON.parse(localStorage.getItem('storeSettings'));
        if (settings?.currencySymbol) {
            setCurrency(settings.currencySymbol);
        }
    }, []);

    const handleOpenDialog = (order = null) => {
        if (order) {
            setIsEdit(true);
            // Robust parsing: Remove currency symbol and commas
            const amount = order.amount ? order.amount.toString().replace(currency + ' ', '').replace(/[^\d.-]/g, '') : '';
            setCurrentOrder({ ...order, amount });
        } else {
            setIsEdit(false);
            setCurrentOrder({ customer: '', location: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
        }
        setOpenDialog(true);
    };

    const handleViewOrder = (order) => {
        const customerDetails = customers.find(c => c.name === order.customer);
        setViewOrder({
            ...order,
            email: customerDetails ? customerDetails.email : 'N/A',
            phone: customerDetails ? customerDetails.phone : 'N/A'
        });
        setOpenViewDialog(true);
    };

    const handlePrintInvoice = () => {
        if (!viewOrder) return;

        const details = {
            "Order ID": viewOrder.id,
            "Date": viewOrder.date,
            "Status": viewOrder.status,
            "Customer Name": viewOrder.customer,
            "Email": viewOrder.email,
            "Phone": viewOrder.phone,
            "Shipping Address": viewOrder.location,
            "Total Amount": viewOrder.amount // Already formatted in DataGrid/API
        };

        generateDetailPDF(`Invoice #${viewOrder.id}`, details, `invoice_${viewOrder.id}.pdf`, 'view');
    };

    const handleSaveOrder = async () => {
        try {
            const formattedOrder = { ...currentOrder, amount: `${currency} ${currentOrder.amount}` };
            if (isEdit) {
                await updateOrder(currentOrder.id, formattedOrder);
                setSnackbar({ open: true, message: 'Order updated successfully!', severity: 'success' });
            } else {
                await createOrder(formattedOrder);
                setSnackbar({ open: true, message: 'Order created successfully!', severity: 'success' });
            }
            await loadData();
            setOpenDialog(false);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: `Failed to ${isEdit ? 'update' : 'create'} order.`, severity: 'error' });
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteOrder(deleteId);
            await loadData();
            setOpenDeleteDialog(false);
            setSnackbar({ open: true, message: 'Order deleted successfully!', severity: 'success' });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Failed to delete order.', severity: 'error' });
        }
    };

    const handleExportPDF = () => {
        const title = "Order Report";
        const columns = ["Order ID", "Customer", "Email", "Phone", "Location", "Amount", "Date", "Status"];
        const data = orders.map(o => {
            const customerDetails = customers.find(c => c.name === o.customer);
            return [
                o.id,
                o.customer,
                customerDetails ? customerDetails.email : 'N/A',
                customerDetails ? customerDetails.phone : 'N/A',
                o.location,
                o.amount, // Already formatted
                o.date,
                o.status
            ];
        });
        generatePDF(title, columns, data, "orders_report.pdf");
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', width: 120 },
        { field: 'customer', headerName: 'Customer', width: 200 },
        { field: 'location', headerName: 'Location', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        { field: 'date', headerName: 'Date', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        bgcolor: params.value === 'Delivered' ? alpha('#10b981', 0.1) : params.value === 'Processing' ? alpha('#3b82f6', 0.1) : params.value === 'Shipped' ? alpha('#a855f7', 0.1) : alpha('#eab308', 0.1),
                        color: params.value === 'Delivered' ? '#15803d' : params.value === 'Processing' ? '#1d4ed8' : params.value === 'Shipped' ? '#7e22ce' : '#a16207',
                        fontWeight: 600,
                    }}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleViewOrder(params.row)} color="info" sx={{ mr: 1 }}>
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(params.row)} color="primary" sx={{ mr: 1 }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper sx={{ height: 600, width: '100%', p: 2, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Order Management</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip label={`Total Orders: ${orders.length}`} color="primary" variant="outlined" />
                        <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF}>
                            Export PDF
                        </Button>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>New Order</Button>
                    </Box>
                </Box>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    pageSizeOptions={[5, 10, 20]}
                    loading={loading}
                    disableRowSelectionOnClick
                />

                {/* View Details Dialog */}
                <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 2 } }}>
                    <DialogTitle sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Order Details
                        <Button startIcon={<PrintIcon />} variant="contained" size="small" onClick={handlePrintInvoice}>
                            Print Invoice
                        </Button>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {viewOrder && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                                    <Typography variant="body1" fontWeight="bold">{viewOrder.id}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                                    <Typography variant="body1">{viewOrder.date}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                    <Chip label={viewOrder.status} size="small" color={viewOrder.status === 'Delivered' ? 'success' : 'primary'} />
                                </Box>
                                <Typography variant="h6" sx={{ mt: 2, borderBottom: '1px solid #eee', pb: 1 }}>Customer Info</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                    <Typography variant="body1">{viewOrder.customer}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                                    <Typography variant="body1">{viewOrder.location}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                                    <Typography variant="body1">{viewOrder.email || 'N/A'} <br /> {viewOrder.phone || ''}</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ mt: 2, borderBottom: '1px solid #eee', pb: 1 }}>Payment</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                                    <Typography variant="h5" color="success.main">{viewOrder.amount}</Typography>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
                    <DialogTitle>{isEdit ? 'Edit Order' : 'Create New Order'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
                            <TextField label="Customer Name" value={currentOrder.customer} onChange={(e) => setCurrentOrder({ ...currentOrder, customer: e.target.value })} fullWidth />
                            <TextField label="Location" value={currentOrder.location} onChange={(e) => setCurrentOrder({ ...currentOrder, location: e.target.value })} fullWidth />
                            <TextField label="Amount" type="number" value={currentOrder.amount} onChange={(e) => setCurrentOrder({ ...currentOrder, amount: e.target.value })} fullWidth />
                            <TextField label="Date" type="date" value={currentOrder.date} onChange={(e) => setCurrentOrder({ ...currentOrder, date: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select value={currentOrder.status} label="Status" onChange={(e) => setCurrentOrder({ ...currentOrder, status: e.target.value })}>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Processing">Processing</MenuItem>
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleSaveOrder} variant="contained">{isEdit ? 'Update' : 'Create'}</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete this order?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </motion.div>
    );
}
