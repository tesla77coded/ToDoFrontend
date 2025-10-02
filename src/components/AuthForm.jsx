import React, { useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

function Message({ text, type = 'info' }) {
  if (!text) return null;
  const isError = type === 'error';
  return (
    <div className={`${isError ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'} border-l-4 p-4 rounded-lg mb-4 flex items-center gap-2`}>
      {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span>{text}</span>
    </div>
  );
}

export default function AuthForm() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!email.trim() || password.length < 6 || (mode === 'register' && !name.trim())) {
      setMessage({ text: 'Please provide valid inputs. Password min 6 chars.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const data = await apiFetch('/users/register', {
          method: 'POST',
          body: { name: name.trim(), email: email.trim(), password }
        });
        setMessage({ text: data?.message || 'Registration successful! Please login.' });
        setMode('login');
      } else {
        const data = await apiFetch('/users/login', {
          method: 'POST',
          body: { email: email.trim(), password }
        });
        const token = data?.token;
        if (!token) throw new Error('No token returned from server.');
        const userFromLogin = {
          _id: data._id,
          name: data.name,
          email: data.email,
          isAdmin: !!data.isAdmin,
        };
        login({ token, user: userFromLogin });
      }
    } catch (err) {
      setMessage({ text: err?.message || 'Network or server error', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              {mode === 'login' ? (
                <LogIn className="text-white" size={32} />
              ) : (
                <UserPlus className="text-white" size={32} />
              )}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mt-2">
              {mode === 'login' ? 'Login to manage your tasks' : 'Sign up to get started'}
            </p>
          </div>

          <Message text={message?.text} type={message?.type} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
              {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {mode === 'login' ? (
                <>Don't have an account? <span className="font-semibold underline">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-semibold underline">Login</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-white text-sm">
          Secure & Reliable Task Management
        </p>
      </div>
    </div>
  );
}
