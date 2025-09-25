import { useState, useEffect } from 'react';
import { User } from '../types';
import { getAllUsers, updateUserDetails } from '../api/ApiCenter';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setUsers(await getAllUsers());
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    updateUserDetails(id, updates).then(updatedUser => {
      setUsers(prev => prev.map(u =>
        u.id === id ? updatedUser : u
      ));
    })
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
    fetchUsers,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById
  };
};