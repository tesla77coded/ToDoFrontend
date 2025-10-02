import React, { useState } from 'react';
import { apiFetch } from '../api/client';
import { Plus, Calendar, ListChecks } from 'lucide-react';

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('in-progress');
  const [subtasksRaw, setSubtasksRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function parseSubtasks(raw) {
    if (!raw) return [];
    return raw.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(title => ({ title, done: false }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Title required');
      return;
    }
    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        status,
        subtasks: parseSubtasks(subtasksRaw)
      };
      const created = await apiFetch('/tasks', { method: 'POST', body });
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('in-progress');
      setSubtasksRaw('');
      onCreated && onCreated(created);
    } catch (err) {
      setError(err?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Create New Task</h3>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex items-start gap-2">
          <span className="font-semibold">Error:</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title *"
            className="col-span-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
          >
            <option value="in-progress">📋 In Progress</option>
            <option value="done">✅ Done</option>
            <option value="expired">⏰ Expired</option>
          </select>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <ListChecks className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              value={subtasksRaw}
              onChange={(e) => setSubtasksRaw(e.target.value)}
              placeholder="Subtasks (comma separated)"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {loading ? 'Creating...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}
