import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions, Resource, PermissionAction } from '../../hooks/usePermissions';
import { Redirect, useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: {
    action: PermissionAction;
    resource: Resource;
  };
  adminOnly?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  adminOnly = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const { can } = usePermissions();
  const [, setLocation] = useLocation();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }
  
  // If admin only and user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-5xl mb-4">
          <i className="ri-lock-2-line"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <button 
          onClick={() => setLocation('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Homepage
        </button>
      </div>
    );
  }
  
  // If required permission is specified, check if user has it
  if (requiredPermission) {
    const { action, resource } = requiredPermission;
    if (!can(action, resource)) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-red-600 text-5xl mb-4">
            <i className="ri-lock-2-line"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to {action} {resource}.</p>
          <button 
            onClick={() => setLocation('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      );
    }
  }
  
  // If all checks pass, render children
  return <>{children}</>;
}