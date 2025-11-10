import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import DashboardDonatur from './features/donatur/DashboardDonatur';
import FormDonasi from './features/donatur/FormDonasi';
import EditDonasi from './features/donatur/EditDonasi';
import NotFound from './pages/NotFound';

import DashboardPenerima from './features/penerima/DashboardPenerima.jsx'; 

import Riwayat from './features/riwayat/Riwayat.jsx';

import ProfilDonatur from './features/donatur/ProfilDonatur.jsx';

import { isAuthenticated, getUserRole } from './utils/localStorage';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && getUserRole() !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dashboard Routes - dengan DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          
          {/* Rute Donatur */}
          <Route 
            path="dashboard-donatur" 
            element={
              <ProtectedRoute requiredRole="donatur">
                <DashboardDonatur />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="donasi/buat" 
            element={
              <ProtectedRoute requiredRole="donatur">
                <FormDonasi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="donasi/edit/:id" 
            element={
              <ProtectedRoute requiredRole="donatur">
                <EditDonasi />
              </ProtectedRoute>
            } 
          />
          
          {/* Rute Profil Donatur */}
          <Route 
            path="donatur/profil" 
            element={
              <ProtectedRoute requiredRole="donatur">
                <ProfilDonatur />
              </ProtectedRoute>
            } 
          />
 
          <Route 
            path="dashboard-penerima" 
            element={
              <ProtectedRoute requiredRole="penerima">
                <DashboardPenerima />
              </ProtectedRoute>
            } 
          />
          
          {/* Rute Riwayat */}
          <Route 
            path="donatur/riwayat" 
            element={
              <ProtectedRoute requiredRole="donatur">
                <Riwayat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="penerima/riwayat" 
            element={
              <ProtectedRoute requiredRole="penerima">
                <Riwayat />
              </ProtectedRoute>
            } 
          />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;