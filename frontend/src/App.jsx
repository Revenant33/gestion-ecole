import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardProfesseur from './pages/DashboardProfesseur';
import DashboardEleve from './pages/DashboardEleve';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/professeur"
        element={
          <ProtectedRoute allowedRole="PROFESSEUR">
            <DashboardProfesseur />
          </ProtectedRoute>
        }
      />

      <Route
        path="/eleve"
        element={
          <ProtectedRoute allowedRole="ELEVE">
            <DashboardEleve />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;