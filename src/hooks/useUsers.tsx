import { useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const addUser = (userData: Omit<User, 'id' |'createdAt' | 'isActive'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...updates } : u
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById
  };
};