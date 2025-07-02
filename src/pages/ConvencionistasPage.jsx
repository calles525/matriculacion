import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ConvencionistaForm from '../components/convencionistas/ConvencionistaForm';
import ConvencionistaTable from '../components/convencionistas/ConvencionistaTable';

export default function ConvencionistasPage() {
  const [refreshTable, setRefreshTable] = React.useState(false);

  const handleSuccess = () => {
    setRefreshTable(prev => !prev);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <ConvencionistaForm onSuccess={handleSuccess} />
        <ConvencionistaTable key={refreshTable} />
      </Box>
    </Container>
  );
}