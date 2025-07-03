import axios from 'axios';

const api = axios.create({
  baseURL: 'http://95.111.249.239:3001/api',
 // baseURL: 'http://localhost:3001/api',
  
  timeout: 10000,
});

// Interceptor para añadir datos de autenticación y zona
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Agregar token de autenticación si existe
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Para solicitudes POST, PUT, PATCH, añadir zona_id y usuario_id si no están presentes
  if (['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
    if (config.data && typeof config.data === 'object') {
      config.data = {
        ...config.data,
        usuario_id: config.data.usuario_id || user.id,
        zona_id: config.data.zona_id || user.zona?.id || user.idzona
      };
    }
  }

  // Para solicitudes GET, añadir zona_id como parámetro si es necesario
  if (config.method.toLowerCase() === 'get') {
    if (user.zona?.id || user.idzona) {
      config.params = {
        ...config.params,
        zona_id: config.params?.zona_id || user.zona?.id || user.idzona
      };
    }
  }

  console.log('Configuración de solicitud:', {
    url: config.url,
    method: config.method,
    data: config.data,
    params: config.params,
    headers: config.headers
  });

  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de respuesta
api.interceptors.response.use(
  response => {
    console.log('Respuesta exitosa:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Error en la respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;