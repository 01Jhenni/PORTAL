
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

export default Index;
