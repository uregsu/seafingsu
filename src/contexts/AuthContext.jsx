import { createContext, useContext, useState } from 'react';
import { authenticate, readSession, saveSession, clearSession } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  async function login(username, password) {
    const nextSession = await authenticate(username, password);
    saveSession(nextSession);
    setSession(nextSession);
  }

  function logout() {
    try {
      clearSession();
    } finally {
      setSession(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, isAuthenticated: Boolean(session), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider.');
  return context;
}
