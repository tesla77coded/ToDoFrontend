import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import UserProfile from '../components/UserProfile';
import UsersList from '../components/UsersList';
import { ChevronDown, ChevronUp, User, Users, LogOut, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [showTasks, setShowTasks] = useState(true);

  function afterCreate() {
    setRefreshFlag((s) => s + 1);
  }

  function afterProfileUpdate() {
    setRefreshFlag((s) => s + 1);
    setShowProfile(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Todo Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2">
                {/* <span className="text-sm text-gray-600"> */}
                {/*   {user?.name || user?.email} */}
                {/* </span> */}
                {user?.isAdmin && (
                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-semibold">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white text-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <User className="group-hover:scale-110 transition-transform" size={24} />
              <span className="font-semibold">My Profile</span>
            </div>
            {showProfile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {user?.isAdmin && (
            <button
              onClick={() => setShowUsersList(!showUsersList)}
              className="bg-white hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white text-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Users className="group-hover:scale-110 transition-transform" size={24} />
                <span className="font-semibold">Manage Users</span>
              </div>
              {showUsersList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}

          <button
            onClick={() => setShowTasks(!showTasks)}
            className="bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white text-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <ListTodo className="group-hover:scale-110 transition-transform" size={24} />
              <span className="font-semibold">My Tasks</span>
            </div>
            {showTasks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Profile Section */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showProfile ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
            </div>
            <UserProfile onUpdated={afterProfileUpdate} />
          </div>
        </div>

        {/* Users List Section (Admin Only) */}
        {user?.isAdmin && (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${showUsersList ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-green-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
              </div>
              <UsersList />
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showTasks ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <ListTodo className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
            </div>
            <TaskForm onCreated={afterCreate} />
            <div className="mt-6">
              <TaskList refreshFlag={refreshFlag} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
