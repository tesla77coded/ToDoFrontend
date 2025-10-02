import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Trash2, Shield, User as UserIcon, Mail, Crown } from 'lucide-react';

export default function UsersList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/users/all');
      setUsers(data?.allUsers || []);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  async function removeUser(u) {
    if (!confirm(`Delete user ${u.email}?`)) return;
    try {
      await apiFetch(`/users/${u._id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      alert(err?.message || 'Failed to delete');
    }
  }

  if (!user?.isAdmin) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserIcon className="mx-auto mb-3 text-gray-300" size={48} />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div 
          key={u._id} 
          className="group bg-gradient-to-r from-white to-gray-50 hover:from-green-50 hover:to-teal-50 border-2 border-gray-100 hover:border-green-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${u.isAdmin ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-purple-500'} text-white font-bold text-lg shadow-lg`}>
                {u.isAdmin ? <Crown size={24} /> : <UserIcon size={24} />}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {u.name || 'Unnamed User'}
                  </h4>
                  {u.isAdmin && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-semibold">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Mail size={14} />
                  <span className="truncate">{u.email}</span>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => removeUser(u)}
              className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete user"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
