import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScholarshipsPage from './pages/ScholarshipsPage'; // adjust path as needed
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage'; // adjust path as needed
import RegisterPage from './pages/RegisterPage'; // adjust path as needed
import DashboardPage from './pages/DashboardPage'; // adjust path as needed
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* other routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* <Route path="/dashboard"element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        /> */}

        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
