import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import HomePage from './pages/HomePage';
import KioskPage from './pages/KioskPage';
import LoginPage from './pages/LoginPage';
import BaristaPage from './pages/BaristaPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
