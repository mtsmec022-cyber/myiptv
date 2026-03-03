import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  type: 'partner' | 'xtream' | null;
  credentials: any | null;
  deviceId: string;
}

interface AuthContextType {
  auth: AuthState;
  loginXtream: (server: string, user: string, pass: string) => Promise<void>;
  loginPartnerCloudGo: (partnerCode: string, user: string, pass: string) => Promise<void>;
  logout: () => void;
}

const PARTNER_CONFIGS: Record<string, string> = {
  'cloudgo': 'http://srvzzi.top'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('vortex_auth');
    if (saved) return JSON.parse(saved);
    return {
      isAuthenticated: false,
      type: null,
      credentials: null,
      deviceId: generateDeviceId(),
    };
  });

  useEffect(() => {
    localStorage.setItem('vortex_auth', JSON.stringify(auth));
  }, [auth]);

  function generateDeviceId() {
    let id = localStorage.getItem('vortex_device_id');
    if (!id) {
      id = 'VX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      localStorage.setItem('vortex_device_id', id);
    }
    return id;
  }

  const loginPartnerCloudGo = async (partnerCode: string, user: string, pass: string) => {
    const server = PARTNER_CONFIGS[partnerCode.toLowerCase()];
    if (!server) {
      throw new Error('Código de parceiro inválido');
    }

    setAuth(prev => ({
      ...prev,
      isAuthenticated: true,
      type: 'xtream',
      credentials: { server, user, pass }
    }));
  };

  const loginXtream = async (server: string, user: string, pass: string) => {
    // Real Xtream Codes validation would happen here
    // For now, we simulate success and store credentials
    setAuth(prev => ({
      ...prev,
      isAuthenticated: true,
      type: 'xtream',
      credentials: { server, user, pass }
    }));
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      type: null,
      credentials: null,
      deviceId: auth.deviceId
    });
  };

  return (
    <AuthContext.Provider value={{ auth, loginXtream, loginPartnerCloudGo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
