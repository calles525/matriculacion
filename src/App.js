import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ConvencionistasPage from './pages/ConvencionistasPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router basename="/idp">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              {/* <Route path="/" element={<DashboardPage />} /> */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/convencionistas" element={<ConvencionistasPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
