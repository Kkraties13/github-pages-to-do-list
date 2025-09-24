import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-lg text-gray-600 dark:text-gray-200">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-zinc-900 transition-colors">
      <button
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded border border-gray-400 bg-white dark:bg-zinc-800 dark:text-white text-black shadow hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        onClick={() => setDark((d) => !d)}
        aria-label="Alternar modo noturno"
      >
        {dark ? 'Modo Claro' : 'Modo Escuro'}
      </button>
      {user ? <TodoList /> : <Auth />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

