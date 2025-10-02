import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { Search, SortAsc, Trash2, CheckCircle, Circle, Calendar, Clock, ListTodo } from 'lucide-react';

const SORT_OPTIONS = [
  { key: 'createdAt:desc', label: 'Created — newest first' },
  { key: 'createdAt:asc', label: 'Created — oldest first' },
  { key: 'dueDate:asc', label: 'Due date — soonest' },
  { key: 'dueDate:desc', label: 'Due date — latest' },
  { key: 'priority:desc', label: 'Priority — high first' },
];

export default function TaskList({ refreshFlag }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState(SORT_OPTIONS[0].key);
  const [query, setQuery] = useState('');
  const [serverQuery, setServerQuery] = useState('');

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (sort) qs.set('sort', sort);
      if (serverQuery) qs.set('q', serverQuery);
      const path = qs.toString() ? `/tasks?${qs.toString()}` : '/tasks';
      const data = await apiFetch(path);
      setTasks(Array.isArray(data) ? data : (data?.tasks || []));
    } catch (err) {
      setError(err?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [refreshFlag, sort, serverQuery]);

  async function toggleComplete(task) {
    try {
      if (typeof task.status !== 'undefined') {
        const newStatus = task.status === 'done' ? 'in-progress' : 'done';
        await apiFetch(`/tasks/${task._id}`, { method: 'PUT', body: { status: newStatus } });
      } else {
        await apiFetch(`/tasks/${task._id}`, { method: 'PUT', body: { completed: !task.completed } });
      }
      fetchTasks();
    } catch (err) {
      setError(err?.message || 'Failed to update');
    }
  }

  async function remove(task) {
    if (!confirm('Delete this task?')) return;
    try {
      await apiFetch(`/tasks/${task._id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      setError(err?.message || 'Failed to delete');
    }
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    setServerQuery(query.trim());
  }

  function fmtDateOnly(dateStr) {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr.split('T')[0] || dateStr;
    }
  }

  function getStatusBadge(task) {
    const status = task.status || (task.completed ? 'done' : 'in-progress');
    const badges = {
      'done': 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'expired': 'bg-red-100 text-red-700'
    };
    return badges[status] || badges['in-progress'];
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
      {error}
    </div>
  );

  if (!tasks.length) return (
    <div className="text-center py-12 text-gray-500">
      <ListTodo className="mx-auto mb-3 text-gray-300" size={48} />
      <p className="text-lg">No tasks yet. Create one above!</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
        <form onSubmit={onSearchSubmit} className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            Search
          </button>
          {serverQuery && (
            <button
              type="button"
              onClick={() => { setQuery(''); setServerQuery(''); }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <SortAsc className="text-gray-600" size={20} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((t) => {
          const isDone = t.status === 'done' || t.completed;
          return (
            <div
              key={t._id}
              className="group bg-white hover:shadow-lg transition-all duration-200 rounded-xl p-5 border-2 border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(t)}
                  className="mt-1 flex-shrink-0"
                >
                  {isDone ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <Circle className="text-gray-300 hover:text-blue-500 transition-colors" size={24} />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`text-lg font-semibold ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {t.title}
                    </h3>
                    <button
                      onClick={() => remove(t)}
                      className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {t.description && (
                    <p className={`text-sm mb-3 ${isDone ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.description}
                    </p>
                  )}

                  {/* Status and Date */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(t)}`}>
                      {t.status || (t.completed ? 'Done' : 'In Progress')}
                    </span>
                    {t.dueDate && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>{fmtDateOnly(t.dueDate)}</span>
                      </div>
                    )}
                    {t.archived && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                        Archived
                      </span>
                    )}
                  </div>

                  {/* Subtasks */}
                  {Array.isArray(t.subtasks) && t.subtasks.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Subtasks</div>
                      <ul className="space-y-2">
                        {t.subtasks.map((s, idx) => (
                          <li key={s._id || idx} className="flex items-center gap-2 text-sm">
                            {s.done ? (
                              <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                            ) : (
                              <Circle className="text-gray-300 flex-shrink-0" size={16} />
                            )}
                            <span className={s.done ? 'line-through text-gray-400' : 'text-gray-700'}>
                              {s.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Created timestamp */}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                    <Clock size={14} />
                    <span>Created {new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
