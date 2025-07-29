export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

export interface Role {
  id: string
  name: string
  color: string
}

export interface ModulePermission {
  moduleId: string
  enabled: boolean
}

export interface RoutePermission {
  routeId: string
  enabled: boolean
}

export interface FunctionalityPermission {
  functionalityId: string
  enabled: boolean
}

export interface RolePermissions {
  roleId: string
  modules: Record<string, boolean>
  routes: Record<string, boolean>
  functionality: Record<string, boolean>
}

export interface PermissionState {
  users: User[]
  roles: Role[]
  permissions: Record<string, RolePermissions>
}

// Enhanced route type for your existing system
export interface EnhancedRoute {
  key: string
  path: string
  component: any
  authority: string[]
  meta?: any
  moduleId?: string
  parentRoute?: string
  level?: number
}
