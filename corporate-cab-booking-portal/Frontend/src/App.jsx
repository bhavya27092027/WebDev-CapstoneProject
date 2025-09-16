import React, { useEffect, useState } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './pages/Register.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'));
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/home" />
                ) : (
                  <LoginForm
                    onLoginSuccess={(userData) => {
                      localStorage.setItem('user', JSON.stringify(userData));
                      setUser(userData);
                    }}
                  />
                )
              }
            />

            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/home" />
                ) : (
                  <RegisterForm
                    onRegisterSuccess={(userData) => {
                      localStorage.setItem('user', JSON.stringify(userData));
                      setUser(userData);
                    }}
                  />
                )
              }
            />

            <Route
              path="/home"
              element={user ? <Home /> : <Navigate to="/login" />}
            />

            {/* Optional: Custom 404 page or redirect */}
            <Route
              path="*"
              element={<Navigate to={user ? "/home" : "/login"} replace />}
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </main>
      </Router>
    </Theme>
  );
}