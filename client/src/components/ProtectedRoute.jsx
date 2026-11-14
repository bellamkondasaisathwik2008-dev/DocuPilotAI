import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          <Loader2 className="h-6 w-6 text-brand-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-sm text-slate-400 font-medium animate-pulse">
          Authenticating secure session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
