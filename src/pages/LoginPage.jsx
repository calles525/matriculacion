import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
  Paper,
  Grid,
  Avatar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Lock as LockIcon, Person as PersonIcon } from '@mui/icons-material';
import { Facebook, Twitter, Google } from '@mui/icons-material';
import logo from '../assets/images/FUEGO.png'; // Asegúrate de tener el logo en esta ruta
const validationSchema = Yup.object({
  username: Yup.string().required('Usuario es requerido'),
  password: Yup.string().required('Contraseña es requerida'),
});

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      setIsSubmitting(true);

      try {
        const result = await login(values.username, values.password);

        if (result.success) {
          navigate('/convencionistas');
        } else {
          setError(result.message || 'Credenciales incorrectas');
        }
      } catch (err) {
        setError('Error de conexión con el servidor');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        width: '100vw', // Ocupa el 100% del viewport width
        height: '100vh', 
      }}
    >
      <Paper
        sx={{
          width: '100%', // Ocupa el 100% del ancho en móviles
          maxWidth: 400, // Máximo ancho en pantallas más grandes
          padding: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: 2,
          margin: 'auto', // Centrado horizontal y vertical
          display: 'flex', // Para manejar mejor el contenido interno
          flexDirection: 'column', // Organiza los elementos internos en columna
          justifyContent: 'center' // Centra el contenido verticalmente dentro del Paper
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <img
            src={logo}
            style={{
              width: 260,
              height: 260,
              margin: '0 auto 16px',
              backgroundColor: 'transparent'
            }}
          />
          <Typography variant="h5" component="h1" sx={{ color: 'white' }}>
            Inicio de Sesión
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Username or Email address"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            InputProps={{
              startAdornment: <PersonIcon sx={{ color: 'white', mr: 1 }} />,
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              }
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: <LockIcon sx={{ color: 'white', mr: 1 }} />,
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              }
            }}
          />



          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              mb: 3,
              backgroundColor: '#4e73df',
              '&:hover': { backgroundColor: '#2e59d9' }
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'INGRESAR'
            )}
          </Button>







        </Box>
      </Paper>
    </Box>

  );
}