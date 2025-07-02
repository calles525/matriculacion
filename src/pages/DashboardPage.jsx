import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

// Componente de tarjeta de estadística
const StatCard = ({ icon, title, value, color }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            color: `${color}.dark`,
            p: 1,
            borderRadius: '50%',
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Paper>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/convencionistas/estadisticas');
        setStats(response.data);
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenido, {user?.nombre_completo}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Zona: {user?.zona?.nombre}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Resumen de Matriculaciones
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<PeopleIcon fontSize="large" />}
                title="Total Convencionistas"
                value={stats?.total || 0}
                color="primary"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<MoneyIcon fontSize="large" />}
                title="Monto Total"
                value={`$${(stats?.montoTotal || 0).toFixed(2)}`}
                color="success"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<ReceiptIcon fontSize="large" />}
                title="Matrículas Normales"
                value={stats?.porTipoMatricula?.find(t => t.tipo_matricula === 'normal')?.cantidad || 0}
                color="info"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<WalletIcon fontSize="large" />}
                title="Matrículas Combo"
                value={stats?.porTipoMatricula?.find(t => t.tipo_matricula === 'combo')?.cantidad || 0}
                color="warning"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Distribución de Pagos
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {stats?.porTipoPago?.map((tipoPago) => (
              <Grid item xs={12} sm={6} md={4} key={tipoPago.tipo_pago}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    {tipoPago.tipo_pago === 'divisa' ? 'Divisas' : 
                     tipoPago.tipo_pago === 'pago_movil' ? 'Pagos Móviles' : 
                     'Transferencias'}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {tipoPago.cantidad}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {((tipoPago.cantidad / stats.total) * 100).toFixed(1)}% del total
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Última actualización: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}