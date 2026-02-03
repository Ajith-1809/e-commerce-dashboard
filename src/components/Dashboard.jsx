import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import PaidIcon from '@mui/icons-material/Paid';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EuroIcon from '@mui/icons-material/Euro';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getDashboardStats, getRecentOrders, getTopCities } from '../api';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [statsData, setStatsData] = React.useState({
    revenue: '₹ 0', revenueTrend: '0%',
    orders: '0', ordersTrend: '0%',
    customers: '0', customersTrend: '0%',
    growth: '0%', growthTrend: '0%'
  });
  const [recentOrders, setRecentOrders] = React.useState([]);
  const [topCities, setTopCities] = React.useState([]);

  const [currency, setCurrency] = React.useState('₹');

  React.useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('storeSettings'));
    if (settings?.currencySymbol) {
      setCurrency(settings.currencySymbol);
    }

    const fetchData = async () => {
      const stats = await getDashboardStats();
      if (stats) setStatsData(stats);

      const orders = await getRecentOrders();
      if (orders) setRecentOrders(orders);

      const cities = await getTopCities();
      if (cities) setTopCities(cities);
    };
    fetchData();
  }, []);

  // Helper to re-format currency strings if they come hardcoded from API
  const formatValue = (val) => {
    if (!val) return val;
    // Remove existing currency symbols and trim
    const cleanVal = val.toString().replace(/[₹$€£¥]/g, '').replace('Rs.', '').trim();
    return `${currency} ${cleanVal}`;
  };

  const getCurrencyIcon = () => {
    switch (currency) {
      case '₹': return CurrencyRupeeIcon;
      case '$': return AttachMoneyIcon;
      case '€': return EuroIcon;
      case '£': return CurrencyPoundIcon;
      case '¥': return CurrencyYenIcon;
      default: return PaidIcon;
    }
  };

  const stats = [
    { title: 'Total Revenue', value: formatValue(statsData.revenue), icon: getCurrencyIcon(), color: '#10b981', trend: statsData.revenueTrend },
    { title: 'Active Orders', value: statsData.orders, icon: ShoppingCartIcon, color: '#f97316', trend: statsData.ordersTrend },
    { title: 'New Customers', value: statsData.customers, icon: PeopleIcon, color: '#6366f1', trend: statsData.customersTrend },
    { title: 'Growth', value: statsData.growth, icon: TrendingUpIcon, color: '#f43f5e', trend: statsData.growthTrend },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index} component={motion.div} variants={itemVariants}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.4)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(stat.color, 0.1), color: stat.color }}>
                  <stat.icon />
                </Box>
                <Chip label={stat.trend} size="small" sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 'bold' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{stat.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>{stat.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} >
        <Grid size={{ xs: 12, lg: 12 }} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 0, overflow: 'hidden', width: '100%', background: 'rgba(30, 41, 59, 0.4)' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>View All</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {row.location}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        <Chip label={row.status} size="small" sx={{ fontWeight: 600, bgcolor: row.status === 'Delivered' ? alpha('#10b981', 0.1) : row.status === 'Processing' ? alpha('#3b82f6', 0.1) : row.status === 'Shipped' ? alpha('#a855f7', 0.1) : alpha('#eab308', 0.1), color: row.status === 'Delivered' ? '#15803d' : row.status === 'Processing' ? '#1d4ed8' : row.status === 'Shipped' ? '#7e22ce' : '#a16207' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 3, height: '100%', width: '100%', background: 'rgba(30, 41, 59, 0.4)' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Top Performing Cities</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {topCities.map((city) => (
                <Box key={city.city}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2" fontWeight={500}>{city.city}</Typography><Typography variant="body2" color="text.secondary">{city.sales}%</Typography></Box>
                  <LinearProgress variant="determinate" value={city.sales} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { borderRadius: 4, background: 'linear-gradient(90deg, #f97316 0%, #e11d48 100%)' } }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}