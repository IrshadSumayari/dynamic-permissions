import type { EnhancedRoute } from "../types/permissions"
import { permissionService } from "../services/permissionService"

// Enhanced route filtering based on permissions
export async function filterRoutesByPermissions(routes: EnhancedRoute[], userId: string): Promise<EnhancedRoute[]> {
  const userPermissions = await permissionService.getUserPermissions(userId)
  if (!userPermissions) return []

  return routes.filter((route) => {
    // Check module access if moduleId is specified
    if (route.moduleId && !userPermissions.modules[route.moduleId]) {
      return false
    }

    // Check route access
    if (!userPermissions.routes[route.key]) {
      return false
    }

    // Check traditional authority
    if (route.authority.length > 0) {
      const hasAuthority = route.authority.some(
        (auth) => userPermissions.modules[auth] || userPermissions.routes[auth] || userPermissions.functionality[auth],
      )
      if (!hasAuthority) return false
    }

    return true
  })
}

// Generate route hierarchy for nested permissions
export function generateRouteHierarchy(routes: EnhancedRoute[]): EnhancedRoute[] {
  const routeMap = new Map<string, EnhancedRoute>()
  const hierarchy: EnhancedRoute[] = []

  // First pass: create route map
  routes.forEach((route) => {
    routeMap.set(route.key, route)
  })

  // Second pass: build hierarchy
  routes.forEach((route) => {
    if (route.parentRoute) {
      const parent = routeMap.get(route.parentRoute)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(route)
      }
    } else {
      hierarchy.push(route)
    }
  })

  return hierarchy
}
