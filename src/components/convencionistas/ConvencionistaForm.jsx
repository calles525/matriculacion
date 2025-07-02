import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import api from '../../api/api';
import { Alert } from '../ui/Alert';

const validationSchema = Yup.object({
  nombre: Yup.string()
    .required('Nombre es requerido')
    .max(50, 'Máximo 50 caracteres'),
  apellido: Yup.string()
    .required('Apellido es requerido')
    .max(50, 'Máximo 50 caracteres'),
  edad: Yup.number()
    .required('Edad es requerida')
    .min(1, 'Edad debe ser mayor a 0')
    .max(120, 'Edad no válida')
    .integer('Debe ser un número entero'),
  tipo_matricula: Yup.string().required('Tipo de matrícula es requerido'),
  tipo_pago: Yup.string().required('Tipo de pago es requerido'),
  referencia_pago: Yup.string()
    .required('Referencia de pago es requerida')
    .max(50, 'Máximo 50 caracteres'),
  monto: Yup.number()
    .required('Monto es requerido')
    .min(0, 'Monto no puede ser negativo')
    .max(1000000, 'Monto demasiado alto')
});

export default function ConvencionistaForm({ onSuccess }) {
  const [alert, setAlert] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const zonaId = user.zona?.id || user.idzona;
  console.log('User data:', user.id, user.idzona);

 const formik = useFormik({
    initialValues: {
     
      nombre: '',
      apellido: '',
      edad: '',
      tipo_matricula: 'normal',
      tipo_pago: 'pago_movil',
      referencia_pago: '',
      monto: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!formik.isValid) return;
      
      setIsSubmitting(true);
      try {
        const response = await api.post('/convencionistas', values, {
      params: {
        usuario_id: user.id,
        zona_id: zonaId
      }
    });
        
        setAlert({
          open: true,
          message: response.data.message || 'Convencionista registrado exitosamente!',
          severity: 'success'
        });
        
        resetForm();
        if (onSuccess) onSuccess();
      } catch (error) {
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.details || 
                            'Error al registrar convencionista';
        
        setAlert({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Registrar Nuevo Convencionista
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleFormSubmit}
        noValidate
        sx={{ mt: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="nombre"
              name="nombre"
              label="Nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="apellido"
              name="apellido"
              label="Apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.apellido && Boolean(formik.errors.apellido)}
              helperText={formik.touched.apellido && formik.errors.apellido}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="edad"
              name="edad"
              label="Edad"
              type="number"
              value={formik.values.edad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.edad && Boolean(formik.errors.edad)}
              helperText={formik.touched.edad && formik.errors.edad}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="tipo_matricula"
              name="tipo_matricula"
              label="Tipo de Matrícula"
              select
              value={formik.values.tipo_matricula}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tipo_matricula && Boolean(formik.errors.tipo_matricula)}
              helperText={formik.touched.tipo_matricula && formik.errors.tipo_matricula}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="combo">Combo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="tipo_pago"
              name="tipo_pago"
              label="Tipo de Pago"
              select
              value={formik.values.tipo_pago}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tipo_pago && Boolean(formik.errors.tipo_pago)}
              helperText={formik.touched.tipo_pago && formik.errors.tipo_pago}
            >
              <MenuItem value="divisa">Divisa</MenuItem>
              <MenuItem value="pago_movil">Pago Móvil</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="referencia_pago"
              name="referencia_pago"
              label="Referencia de Pago"
              value={formik.values.referencia_pago}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.referencia_pago && Boolean(formik.errors.referencia_pago)}
              helperText={formik.touched.referencia_pago && formik.errors.referencia_pago}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="monto"
              name="monto"
              label="Monto"
              type="number"
              value={formik.values.monto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.monto && Boolean(formik.errors.monto)}
              helperText={formik.touched.monto && formik.errors.monto}
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={isSubmitting || !formik.isValid}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Registrar Convencionista'
          )}
        </Button>
      </Box>

    {/*  <Alert
        open={alert.open}
        onClose={() => setAlert({...alert, open: false})}
        severity={alert.severity}
        message={alert.message}
      />*/}
    </Paper>
  );
}