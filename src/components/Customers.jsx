import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api';
import { motion } from 'framer-motion';
import { generatePDF, generateDetailPDF } from '../utils/reportUtils';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Customers() {
  const [customers, setCustomers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentCustomer, setCurrentCustomer] = React.useState({ name: '', email: '', phone: '', location: '', orders: 0, status: 'Active' });
  const [isEdit, setIsEdit] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  // View Dialog State
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [viewCustomer, setViewCustomer] = React.useState(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setIsEdit(true);
      setCurrentCustomer({ ...customer });
    } else {
      setIsEdit(false);
      setCurrentCustomer({ name: '', email: '', phone: '', location: '', orders: 0, status: 'Active' });
    }
    setOpenDialog(true);
  };

  const handleViewCustomer = (customer) => {
    setViewCustomer(customer);
    setOpenViewDialog(true);
  };

  const handlePrintProfile = () => {
    if (!viewCustomer) return;

    const details = {
      "Customer ID": viewCustomer.id,
      "Full Name": viewCustomer.name,
      "Email Address": viewCustomer.email,
      "Phone Number": viewCustomer.phone,
      "Location": viewCustomer.location,
      "Total Orders": viewCustomer.orders,
      "Account Status": viewCustomer.status
    };

    generateDetailPDF(`Customer Profile: ${viewCustomer.name}`, details, `customer_${viewCustomer.id}.pdf`, 'view');
  };

  const handleSaveCustomer = async () => {
    try {
      if (isEdit) {
        await updateCustomer(currentCustomer.id, currentCustomer);
        setSnackbar({ open: true, message: 'Customer updated successfully!', severity: 'success' });
      } else {
        await createCustomer(currentCustomer);
        setSnackbar({ open: true, message: 'Customer created successfully!', severity: 'success' });
      }
      await loadCustomers();
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: `Failed to ${isEdit ? 'update' : 'create'} customer.`, severity: 'error' });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCustomer(deleteId);
      await loadCustomers();
      setOpenDeleteDialog(false);
      setSnackbar({ open: true, message: 'Customer deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Failed to delete customer.', severity: 'error' });
    }
  };

  const handleExportPDF = () => {
    const title = "Customer Report";
    const columns = ["ID", "Name", "Email", "Phone", "Location", "Orders", "Status"];
    const data = customers.map(c => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.location,
      c.orders,
      c.status
    ]);
    generatePDF(title, columns, data, "customers_report.pdf");
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Customer',
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: stringToColor(params.value || 'Unknown') }}>
            {(params.value || 'U').charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>{params.value || 'Unknown'}</Typography>
        </Box>
      )
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'orders', headerName: 'Orders', type: 'number', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: params.value === 'Active' ? alpha('#10b981', 0.1) : params.value === 'Inactive' ? alpha('#ef4444', 0.1) : alpha('#3b82f6', 0.1),
            color: params.value === 'Active' ? '#15803d' : params.value === 'Inactive' ? '#b91c1c' : '#1d4ed8',
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
          <IconButton onClick={() => handleViewCustomer(params.row)} color="info" sx={{ mr: 1 }}>
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Paper sx={{ height: 600, width: '100%', p: 2, background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Customer Database</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={`Total Customers: ${customers.length}`} color="primary" variant="outlined" />
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Customer</Button>
          </Box>
        </Box>
        <DataGrid
          rows={customers}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          loading={loading}
          sx={{ border: 'none', color: 'text.secondary' }}
        />

        {/* View Details Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 2 } }}>
          <DialogTitle sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Customer Profile
            <Button startIcon={<PrintIcon />} variant="contained" size="small" onClick={handlePrintProfile}>
              Print Profile
            </Button>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {viewCustomer && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{viewCustomer.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{viewCustomer.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{viewCustomer.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{viewCustomer.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Total Orders</Typography>
                  <Typography variant="body1">{viewCustomer.orders}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={viewCustomer.status} size="small" color={viewCustomer.status === 'Active' ? 'success' : 'warning'} />
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
          <DialogTitle>{isEdit ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
              <TextField label="Name" value={currentCustomer.name} onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })} fullWidth />
              <TextField label="Email" value={currentCustomer.email} onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })} fullWidth />
              <TextField label="Phone" value={currentCustomer.phone} onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })} fullWidth />
              <TextField label="Location" value={currentCustomer.location} onChange={(e) => setCurrentCustomer({ ...currentCustomer, location: e.target.value })} fullWidth />
              <TextField label="Orders Count" type="number" value={currentCustomer.orders} onChange={(e) => setCurrentCustomer({ ...currentCustomer, orders: Number(e.target.value) })} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={currentCustomer.status} label="Status" onChange={(e) => setCurrentCustomer({ ...currentCustomer, status: e.target.value })}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveCustomer} variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this customer?</DialogContentText>
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

// Helper to generate consistent colors from strings
function stringToColor(string) {
  if (!string) return '#000000'; // Default color for null/undefined
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  /* eslint-enable no-bitwise */

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}