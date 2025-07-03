import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  IconButton,
  Tooltip,
  Button,
  ButtonGroup,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Refresh, FilterList, ChildCare, Groups, Male, Female } from '@mui/icons-material';
import api from '../../api/api';
import { Alert } from '../ui/Alert';

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatTipoMatricula = (tipo) => {
  return tipo === 'normal' ? 'Normal' : 'Combo';
};

const formatTipoPago = (tipo) => {
  const tipos = {
    'divisa': 'Divisa',
    'pago_movil': 'Pago Móvil',
    'transferencia': 'Transferencia'
  };
  return tipos[tipo] || tipo;
};

const formatTipoAsamblea = (tipo) => {
  const tipos = {
    'Niño': 'Niño',
    'Asambleista': 'Asambleista',
    'Visita': 'Visita',
    'Invitado Especial': 'Invitado Especial'
  };
  return tipos[tipo] || tipo;
};

export default function ConvencionistaTable() {
  const [convencionistas, setConvencionistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fecha_registro');
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState('todos'); // 'todos', 'menores', 'asambleistas'
  const [sexoFilter, setSexoFilter] = useState('todos'); // 'todos', 'Masculino', 'Femenino'

  useEffect(() => {
    const fetchConvencionistas = async () => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
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

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefresh(!refresh);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleSexoFilterChange = (event) => {
    setSexoFilter(event.target.value);
    setPage(0);
  };

  const filteredData = convencionistas
    .filter(item => {
      // Filtro por búsqueda
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        item.nombre.toLowerCase().includes(searchLower) ||
        item.apellido.toLowerCase().includes(searchLower) ||
        item.referencia_pago.toLowerCase().includes(searchLower) ||
        item.tipo_matricula.toLowerCase().includes(searchLower) ||
        item.tipo_pago.toLowerCase().includes(searchLower)
      );

      // Filtro por tipo (botones)
      let matchesFilter = true;
      switch(filter) {
        case 'menores':
          matchesFilter = parseInt(item.edad) < 12;
          break;
        case 'asambleistas':
          matchesFilter = item.tipo_asamblea === 'Asambleista';
          break;
        default:
          matchesFilter = true;
      }

      // Filtro por sexo
      let matchesSexo = true;
      if (sexoFilter !== 'todos') {
        matchesSexo = item.sexo === sexoFilter;
      }

      return matchesSearch && matchesFilter && matchesSexo;
    })
    .sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const emptyRows = 
    rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

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

  return (
    <Box sx={{ width: '100%', mt: 2, backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Convencionistas
        </Typography>
        <Box>
          <Tooltip title="Refrescar">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar convencionista"
          variant="outlined"
          size="small"
          sx={{ minWidth: 250, flexGrow: 1 }}
          value={searchTerm}
          onChange={handleSearch}
        />

        <ButtonGroup variant="contained" sx={{ flexShrink: 0 }}>
          <Button 
            color={filter === 'todos' ? 'primary' : 'inherit'}
            onClick={() => setFilter('todos')}
          >
            Todos
          </Button>
          <Button 
            color={filter === 'menores' ? 'primary' : 'inherit'}
            onClick={() => setFilter('menores')}
            startIcon={<ChildCare />}
          >
           Niños
          </Button>
          <Button 
            color={filter === 'asambleistas' ? 'primary' : 'inherit'}
            onClick={() => setFilter('asambleistas')}
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
      </Box>

      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 250 }}>
          <Table stickyHeader aria-label="tabla de convencionistas">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'nombre'}
                    direction={orderBy === 'nombre' ? order : 'asc'}
                    onClick={() => handleSort('nombre')}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'apellido'}
                    direction={orderBy === 'apellido' ? order : 'asc'}
                    onClick={() => handleSort('apellido')}
                  >
                    Apellido
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Edad</TableCell>
                <TableCell>Sexo</TableCell>
                <TableCell>Tipo Matrícula</TableCell>
                <TableCell>Tipo Pago</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell>Participación</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'fecha_registro'}
                    direction={orderBy === 'fecha_registro' ? order : 'asc'}
                    onClick={() => handleSort('fecha_registro')}
                  >
                    Fecha Registro
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.apellido}</TableCell>
                    <TableCell align="right">{row.edad || '-'}</TableCell>
                    <TableCell>
                      {row.sexo === 'Masculino' ? 
                        <Male color="primary" /> : 
                        <Female color="secondary" />}
                    </TableCell>
                    <TableCell>{formatTipoMatricula(row.tipo_matricula)}</TableCell>
                    <TableCell>{formatTipoPago(row.tipo_pago)}</TableCell>
                    <TableCell>{row.referencia_pago}</TableCell>
                    <TableCell align="right">{formatCurrency(parseFloat(row.monto))}</TableCell>
                    <TableCell>
                      <Chip 
                        label={formatTipoAsamblea(row.tipo_asamblea)} 
                        color={
                          row.tipo_asamblea === 'Asambleista' ? 'primary' : 
                          row.tipo_asamblea === 'Invitado Especial' ? 'secondary' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.fecha_registro)}</TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={10} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="body2" color="text.secondary">
          Total registros: {filteredData.length}
        </Typography>
      </Box>
    </Box>
  );
}