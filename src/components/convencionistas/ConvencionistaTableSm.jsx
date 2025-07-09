import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Tooltip,
  Button,
  ButtonGroup,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { Refresh, ChildCare, Groups, Male, Female } from '@mui/icons-material';
import api from '../../api/api';
import { Alert } from '../ui/Alert';

export default function ConvencionistaList() {
  const [convencionistas, setConvencionistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState('todos');
  const [sexoFilter, setSexoFilter] = useState('todos');

  useEffect(() => {
    const fetchConvencionistas = async () => {
      try {
        const response = await api.get(`/convencionistas`);
        setConvencionistas(response.data.data || response.data);
      } catch (err) {
        console.error('Error al obtener convencionistas:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchConvencionistas();
  }, [refresh]);

  const handleRefresh = () => {
    setLoading(true);
    setRefresh(!refresh);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSexoFilterChange = (event) => {
    setSexoFilter(event.target.value);
  };

  const filteredData = convencionistas.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      item.nombre.toLowerCase().includes(searchLower) ||
      item.apellido.toLowerCase().includes(searchLower)
    );

    let matchesFilter = true;
    switch (filter) {
      case 'menores':
        matchesFilter = parseInt(item.edad) < 12;
        break;
      case 'asambleistas':
        matchesFilter = item.tipo_asamblea === 'Asambleista';
        break;
      default:
        matchesFilter = true;
    }

    let matchesSexo = true;
    if (sexoFilter !== 'todos') {
      matchesSexo = item.sexo === sexoFilter;
    }

    return matchesSearch && matchesFilter && matchesSexo;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Alert
          severity="error"
          message={error}
          onClose={() => setError(null)}
        />
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  

  return (
    <Box sx={{ width: '100%', mt: 2, p: 2,backgroundColor: '#fff' }}>
      {/* Barra de herramientas: buscador y filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Buscar convencionista"
          variant="outlined"
          size="small"
          sx={{ minWidth: 250, flexGrow: 1 }}
          value={searchTerm}
          onChange={handleSearch}
        />

        <ButtonGroup variant="contained" sx={{ flexShrink: 0, flexWrap: 'wrap' }}>
          <Button
            color={filter === 'todos' ? 'primary' : 'inherit'}
            onClick={() => handleFilterChange('todos')}
          >
            Todos
          </Button>
          <Button
            color={filter === 'menores' ? 'primary' : 'inherit'}
            onClick={() => handleFilterChange('menores')}
            startIcon={<ChildCare />}
          >
            Niños
          </Button>
          <Button
            color={filter === 'asambleistas' ? 'primary' : 'inherit'}
            onClick={() => handleFilterChange('asambleistas')}
            startIcon={<Groups />}
          >
            Asambleistas
          </Button>
        </ButtonGroup>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="sexo-filter-label">Sexo</InputLabel>
          <Select
            labelId="sexo-filter-label"
            id="sexo-filter"
            value={sexoFilter}
            label="Sexo"
            onChange={handleSexoFilterChange}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="Masculino">
              <Box display="flex" alignItems="center">
                <Male sx={{ mr: 1 }} /> Masculino
              </Box>
            </MenuItem>
            <MenuItem value="Femenino">
              <Box display="flex" alignItems="center">
                <Female sx={{ mr: 1 }} /> Femenino
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Refrescar">
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Lista */}
      {filteredData.length === 0 ? (
  <Typography variant="body1" align="center" sx={{ mt: 4 }}>
    No se encontraron convencionistas.
  </Typography>
) : (
  <Box
    sx={{
      maxHeight: 400, // altura máxima (ajusta a tu gusto)
      overflowY: 'auto',
      pr: 1, // para evitar que el scrollbar tape el contenido
    }}
  >
    <Stack spacing={2}>
      {filteredData.map(item => (
        <Card key={item.id} variant="outlined" sx={{ p: 1 }}>
          <CardContent>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.nombre} {item.apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Edad: {item.edad}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha Registro: {formatDate(item.fecha_registro)}
              </Typography>
              <Chip
                label={item.tipo_asamblea || 'N/A'}
                color={item.tipo_asamblea === 'Asambleista' ? 'success' : 'default'}
                size="small"
              />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
)}

 
    </Box>
  );
}
