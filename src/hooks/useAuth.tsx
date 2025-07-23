
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  companies?: Company[];
}

interface Company {
  id: string;
  name: string;
  cnpj: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing token
    const token = localStorage.getItem('fiscai_token');
    const userData = localStorage.getItem('fiscai_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('fiscai_token');
        localStorage.removeItem('fiscai_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    if (email === 'admin@fiscai.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email: 'admin@fiscai.com',
        name: 'Administrador',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('fiscai_token', 'mock_admin_token');
      localStorage.setItem('fiscai_user', JSON.stringify(adminUser));
      setLoading(false);
      return true;
    } else if (email === 'cliente@empresa.com' && password === 'cliente123') {
      const clientUser: User = {
        id: '2',
        email: 'cliente@empresa.com',
        name: 'Cliente Exemplo',
        role: 'client',
        companies: [
          { id: '1', name: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90', active: true },
          { id: '2', name: 'Comércio XYZ Eireli', cnpj: '98.765.432/0001-10', active: true }
        ]
      };
      setUser(clientUser);
      localStorage.setItem('fiscai_token', 'mock_client_token');
      localStorage.setItem('fiscai_user', JSON.stringify(clientUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fiscai_token');
    localStorage.removeItem('fiscai_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
