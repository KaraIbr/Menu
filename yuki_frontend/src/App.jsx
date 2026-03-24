import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import KioskPage from './pages/KioskPage';
import BaristaPage from './pages/BaristaPage';
import LoginPage from './pages/LoginPage';
import useAuthStore from './store/authStore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2C2C2A',
            color: '#FFFFFF',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#1D9E75',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/kiosk" replace />} />
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/barista"
          element={
            <ProtectedRoute>
              <BaristaPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
