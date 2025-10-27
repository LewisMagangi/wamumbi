import React, { ReactNode } from 'react';
import { usePermissions, Resource, PermissionAction } from '../../hooks/usePermissions';

interface PermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  action: PermissionAction;
  resource: Resource;
}

/**
 * A component that conditionally renders its children based on user permissions.
 * If the user doesn't have the required permission, it renders the fallback component.
 */
export function PermissionGate({ 
  children, 
  fallback = null, 
  action, 
  resource 
}: PermissionGateProps) {
  const { can } = usePermissions();
  
  // Check if user has permission
  const hasPermission = can(action, resource);
  
  // If user has permission, render children, otherwise render fallback
  return <>{hasPermission ? children : fallback}</>;
}

/**
 * Specialized PermissionGate for edit actions
 */
export function EditPermissionGate({ 
  children, 
  fallback = null, 
  resource 
}: Omit<PermissionGateProps, 'action'> & { resource: Resource }) {
  return (
    <PermissionGate action="update" resource={resource} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Specialized PermissionGate for create actions
 */
export function CreatePermissionGate({ 
  children, 
  fallback = null, 
  resource 
}: Omit<PermissionGateProps, 'action'> & { resource: Resource }) {
  return (
    <PermissionGate action="create" resource={resource} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Specialized PermissionGate that only renders for admins
 */
export function AdminGate({ 
  children, 
  fallback = null 
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAdmin } = usePermissions();
  
  return <>{isAdmin ? children : fallback}</>;
}