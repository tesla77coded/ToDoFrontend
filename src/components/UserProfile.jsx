import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { Save, Mail, User as UserIcon, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserProfile({ onUpdated }) {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!user) return null;

  async function handleUpdate(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const body = { name: name.trim(), email: email.trim() };
      if (password) body.password = password;
      const updated = await apiFetch(`/users/${user._id}`, { method: 'PUT', body });
      const newUser = {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        isAdmin: !!updated.isAdmin,
      };
      login({ token: localStorage.getItem('token'), user: newUser });
      setPassword('');
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      onUpdated && onUpdated();
    } catch (err) {
      setMsg({ text: err?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {msg && (
        <div className={`${msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'} border-l-4 p-4 rounded-lg mb-4 flex items-center gap-2`}>
          {msg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>

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
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (leave blank to keep current)"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
