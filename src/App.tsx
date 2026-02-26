import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import List from './pages/List';
import Details from './pages/Details';
import PhotoResult  from './pages/PhotoResult';
import Login from './pages/Login';
import { fetchEmployees } from './services/api';
import type { User, Employee } from "./types";
import './App.css';

const App = () => {

  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // for API loading state
  const [error, setError] = useState<string | null>(null); // for API errors

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employee data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
    
  }, []);

  const handleLogin = (userData : User ) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCapturePhoto = (employeeId: number, image: string) => {
    localStorage.setItem('capturedPhoto', JSON.stringify({ employeeId, image }));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/list" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute user={user}>
              <List
                employees={employees}
                onSelectEmployee={handleSelectEmployee}
                user={user}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details"
          element={
            <ProtectedRoute user={user}>
              {selectedEmployee ? (
                <Details
                  employee={selectedEmployee}
                  onCapturePhoto={handleCapturePhoto}
                  onBack={() => setSelectedEmployee(null)}
                />
              ) : (
                <Navigate to="/list" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/photo-result"
          element={
            <ProtectedRoute user={user}>
              <PhotoResult />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;



