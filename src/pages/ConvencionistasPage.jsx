import React from 'react';
import { Box, Container } from '@mui/material';
import ConvencionistaForm from '../components/convencionistas/ConvencionistaForm';
import ConvencionistaTable from '../components/convencionistas/ConvencionistaTable';
import ConvencionistaList from '../components/convencionistas/ConvencionistaTableSm';

export default function ConvencionistasPage() {
  const [refreshTable, setRefreshTable] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const handleSuccess = () => {
    setRefreshTable(prev => !prev);
  };

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
    <Container maxWidth="lg" >
      <Box>
       
        <ConvencionistaForm onSuccess={handleSuccess}  />
        {parseInt(windowWidth) > 500 ?
        <ConvencionistaTable key={refreshTable} />
        
         : 
         <ConvencionistaList key={refreshTable} />
         }
       {/*   */}
      </Box>
    </Container>
  );
}
