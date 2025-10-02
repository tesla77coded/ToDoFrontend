import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';

function MainFrame() {
  const { token } = useAuth();
  return (
    <div className="container mx-auto p-4">
      {!token ? <AuthForm /> : <Dashboard />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <MainFrame />
      </div>
    </AuthProvider>
  );
}
