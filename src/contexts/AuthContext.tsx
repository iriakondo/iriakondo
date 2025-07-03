import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données de démonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@moukona-ghieme.ga',
    firstName: 'Super',
    lastName: 'Administrateur',
    phone: '+241 00 00 00 00',
    address: 'Libreville, Gabon',
    dateOfBirth: '1970-01-01',
    role: 'super_admin',
    membershipStatus: 'active',
    membershipType: 'worker',
    cotisationAmount: 10000,
    joinDate: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'marie.ghieme@email.com',
    firstName: 'Marie',
    lastName: 'GHIEME',
    phone: '+241 01 23 45 67',
    address: 'Libreville, Gabon',
    dateOfBirth: '1985-03-15',
    role: 'admin',
    membershipStatus: 'active',
    membershipType: 'worker',
    cotisationAmount: 10000,
    parentRelation: 'Fille de Marguerite GHIEME',
    joinDate: '2024-01-15',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'jean.ghieme@email.com',
    firstName: 'Jean',
    lastName: 'GHIEME',
    phone: '+241 07 89 12 34',
    address: 'Moanda, Gabon',
    dateOfBirth: '1992-07-22',
    role: 'member',
    membershipStatus: 'active',
    membershipType: 'student',
    cotisationAmount: 1000,
    parentRelation: 'Petit-fils de Marguerite GHIEME',
    joinDate: '2024-02-01',
    lastLogin: new Date().toISOString(),
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem('moukona_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'une authentification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérification des identifiants par défaut pour le super admin
    if (email === 'admin' && password === 'root') {
      const superAdmin = mockUsers[0];
      setUser(superAdmin);
      localStorage.setItem('moukona_user', JSON.stringify(superAdmin));
      setIsLoading(false);
      return true;
    }
    
    // Vérification des autres utilisateurs
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('moukona_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moukona_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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