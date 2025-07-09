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
  CircularProgress,
  FormControl,
  InputLabel,
  Select
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
    .nullable()
    .min(1, 'Edad debe ser mayor a 0')
    .max(120, 'Edad no válida')
    .integer('Debe ser un número entero'),
  sexo: Yup.string().required('Sexo es requerido'),
  tipo_matricula: Yup.string().required('Tipo de matrícula es requerido'),
  tipo_pago: Yup.string().required('Tipo de pago es requerido'),
  referencia_pago: Yup.string()
    .required('Referencia de pago es requerida')
    .max(50, 'Máximo 50 caracteres'),
  monto: Yup.number()
    .required('Monto es requerido')
    .min(0, 'Monto no puede ser negativo')
    .max(1000000, 'Monto demasiado alto'),
  tipo_asamblea: Yup.string().required('Tipo de participación es requerido')
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

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      edad: '',
      sexo: '',
      tipo_matricula: 'normal',
      tipo_pago: 'pago_movil',
      referencia_pago: '',
      monto: '',
      tipo_asamblea: 'Visita' // Valor por defecto como en el backend
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


  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  
  
  
    React.useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
  
      // Limpieza para evitar memory leaks
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

  return (
    <Paper  sx={{ p: 3 , mt:windowWidth < 500 ? 80 : 0}}>
      <Typography variant="h6" gutterBottom >
        Registrar Nuevo Convencionista
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleFormSubmit}
        noValidate
        
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
            <FormControl fullWidth>
              <InputLabel id="sexo-label">Sexo</InputLabel>
              <Select
                labelId="sexo-label"
                id="sexo"
                name="sexo"
                label="Sexo"
                value={formik.values.sexo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sexo && Boolean(formik.errors.sexo)}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
              </Select>
            </FormControl>
            {formik.touched.sexo && formik.errors.sexo && (
              <Typography color="error" variant="caption">
                {formik.errors.sexo}
              </Typography>
            )}
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
              <MenuItem value="normal">General</MenuItem>
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
              label="Referencia o Serial de Billete"
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
             
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="tipo_asamblea"
              name="tipo_asamblea"
              label="Tipo de Participación"
              select
              value={formik.values.tipo_asamblea}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tipo_asamblea && Boolean(formik.errors.tipo_asamblea)}
              helperText={formik.touched.tipo_asamblea && formik.errors.tipo_asamblea}
            >
              <MenuItem value="Niño">Niño</MenuItem>
              <MenuItem value="Asambleista">Asambleista</MenuItem>
              <MenuItem value="Visita">Visita</MenuItem>
            </TextField>
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

     
    </Paper>
  );
}