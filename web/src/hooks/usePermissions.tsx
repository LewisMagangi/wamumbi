import { useAuth } from '../contexts/AuthContext';

// Define permission actions
export type PermissionAction = 'read' | 'create' | 'update' | 'delete';

// Define resources in the system
export type Resource = 
  | 'campaigns'
  | 'events'
  | 'projects'
  | 'teams'
  | 'blog'
  | 'donations'
  | 'volunteers'
  | 'discussions'
  | 'comments'
  | 'polls'
  | 'profile'
  | 'registrations';

export function usePermissions() {
  const { hasPermission, isAdmin } = useAuth();
  
  // Helper function to check if user can perform action on resource
  const can = (action: PermissionAction, resource: Resource) => {
    return hasPermission(action, resource);
  };
  
  // Helper function to check if user can edit a resource
  const canEdit = (resource: Resource) => {
    return hasPermission('update', resource);
  };
  
  // Helper function to check if user can create a resource
  const canCreate = (resource: Resource) => {
    return hasPermission('create', resource);
  };
  
  // Helper function to check if user can delete a resource
  const canDelete = (resource: Resource) => {
    return hasPermission('delete', resource);
  };
  
  return {
    can,
    canEdit,
    canCreate,
    canDelete,
    isAdmin
  };
}