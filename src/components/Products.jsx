import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
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
import { getProducts, createProduct, deleteProduct, updateProduct } from '../api';
import { motion } from 'framer-motion';

import { generatePDF, generateDetailPDF } from '../utils/reportUtils';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Products() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState({ name: '', category: '', price: '', stock: '', status: 'In Stock' });
  const [isEdit, setIsEdit] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  // Currency State
  const [currency, setCurrency] = React.useState('₹');

  // View Dialog State
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [viewProduct, setViewProduct] = React.useState(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  React.useEffect(() => {
    loadProducts();
    const settings = JSON.parse(localStorage.getItem('storeSettings'));
    if (settings?.currencySymbol) {
      setCurrency(settings.currencySymbol);
    }
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setIsEdit(true);
      setCurrentProduct({ ...product });
    } else {
      setIsEdit(false);
      setCurrentProduct({ name: '', category: '', price: '', stock: '', status: 'In Stock' });
    }
    setOpenDialog(true);
  };

  const handleViewProduct = (product) => {
    setViewProduct(product);
    setOpenViewDialog(true);
  };

  const handlePrintSheet = () => {
    if (!viewProduct) return;

    const details = {
      "Product ID": viewProduct.id,
      "Name": viewProduct.name,
      "Category": viewProduct.category,
      "Price": `${currency} ${viewProduct.price}`,
      "Stock Level": viewProduct.stock,
      "Status": viewProduct.status
    };

    generateDetailPDF(`Product Sheet: ${viewProduct.name}`, details, `product_${viewProduct.id}.pdf`, 'view');
  };

  const handleSaveProduct = async () => {
    // Convert inputs to numbers for the backend
    const productPayload = {
      ...currentProduct,
      price: parseFloat(currentProduct.price),
      stock: parseInt(currentProduct.stock)
    };

    try {
      if (isEdit) {
        await updateProduct(currentProduct.id, productPayload);
        setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
      } else {
        await createProduct(productPayload);
        setSnackbar({ open: true, message: 'Product added successfully!', severity: 'success' });
      }
      await loadProducts(); // Refresh list
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      setSnackbar({ open: true, message: `Failed to ${isEdit ? 'update' : 'add'} product.`, severity: 'error' });
    }
  };

  const handleDeleteClick = (id) => {
    if (!id) {
      console.error("Error: ID is missing.");
      return;
    }
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteId);
      await loadProducts();
      setOpenDeleteDialog(false);
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error("Failed to delete product:", error);
      setSnackbar({ open: true, message: 'Failed to delete product.', severity: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportPDF = () => {
    const title = "Product Inventory Report";
    const columns = ["ID", "Name", "Category", `Price (${currency})`, "Stock", "Status"];
    const data = products.map(p => [
      p.id,
      p.name,
      p.category,
      p.price, // Send raw number, header indicates currency
      p.stock,
      p.status
    ]);
    generatePDF(title, columns, data, "products_report.pdf");
  };

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => `${currency} ${params.value}`
    },
    { field: 'stock', headerName: 'Stock', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: params.value === 'In Stock' ? alpha('#10b981', 0.1) : params.value === 'Low Stock' ? alpha('#eab308', 0.1) : alpha('#ef4444', 0.1),
            color: params.value === 'In Stock' ? '#15803d' : params.value === 'Low Stock' ? '#a16207' : '#b91c1c',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleViewProduct(params.row)} color="info" sx={{ mr: 1 }}>
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
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Paper sx={{ height: 600, width: '100%', p: 2, background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Product Inventory</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={`Total Items: ${products.length}`} color="primary" variant="outlined" />
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Product</Button>
          </Box>
        </Box>
        <DataGrid rows={products} columns={productColumns} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }} pageSizeOptions={[5, 10]} checkboxSelection disableRowSelectionOnClick />

        {/* View Details Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 2 } }}>
          <DialogTitle sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Product Details
            <Button startIcon={<PrintIcon />} variant="contained" size="small" onClick={handlePrintSheet}>
              Print Sheet
            </Button>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {viewProduct && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{viewProduct.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{viewProduct.category}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                  <Typography variant="body1" color="success.main">{currency} {viewProduct.price}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Stock</Typography>
                  <Typography variant="body1">{viewProduct.stock} units</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={viewProduct.status} size="small" color={viewProduct.status === 'In Stock' ? 'success' : 'warning'} />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
              <TextField label="Product Name" value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} fullWidth />
              <TextField label="Category" value={currentProduct.category} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })} fullWidth />
              <TextField label="Price" value={currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} fullWidth />
              <TextField label="Stock" type="number" value={currentProduct.stock} onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={currentProduct.status} label="Status" onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value })}>
                  <MenuItem value="In Stock">In Stock</MenuItem>
                  <MenuItem value="Low Stock">Low Stock</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct} variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
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