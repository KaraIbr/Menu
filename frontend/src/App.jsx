import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import KioskPage from './pages/KioskPage';
import LoginPage from './pages/LoginPage';
import BaristaPage from './pages/BaristaPage';
import AdminPanel from './pages/AdminPanel';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/barista"
          element={
            <ProtectedRoute allowedRoles={['barista', 'cocinero']}>
              <BaristaPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Poppins, sans-serif',
            background: '#3e3a36',
            color: '#f2efea',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
