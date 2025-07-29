"use client"

import { useMemo, useEffect, useState } from "react"
import { permissionService } from "../services/permissionService"
import type { RolePermissions } from "../types/permissions"

// Enhanced version of your usePermission hook
export function useEnhancedPermission(userId: string) {
  const [permissions, setPermissions] = useState<RolePermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true)
        const userPermissions = await permissionService.getUserPermissions(userId)
        setPermissions(userPermissions)
      } catch (error) {
        console.error("Failed to load permissions:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadPermissions()
    }
  }, [userId])

  const hasModuleAccess = useMemo(() => {
    return (moduleId: string): boolean => {
      if (!permissions) return false
      return permissions.modules[moduleId] || false
    }
  }, [permissions])

  const hasRouteAccess = useMemo(() => {
    return (routeId: string): boolean => {
      if (!permissions) return false
      return permissions.routes[routeId] || false
    }
  }, [permissions])

  const hasFunctionalityAccess = useMemo(() => {
    return (functionalityId: string): boolean => {
      if (!permissions) return false
      return permissions.functionality[functionalityId] || false
    }
  }, [permissions])

  // Enhanced authority check that works with your existing system
  const hasAuthority = useMemo(() => {
    return (authority: string[]): boolean => {
      if (!permissions || !authority.length) return false

      // Check if any of the required authorities match available permissions
      return authority.some((auth) => {
        // Check module access
        if (permissions.modules[auth]) return true
        // Check route access
        if (permissions.routes[auth]) return true
        // Check functionality access
        if (permissions.functionality[auth]) return true
        return false
      })
    }
  }, [permissions])

  return {
    permissions,
    loading,
    hasModuleAccess,
    hasRouteAccess,
    hasFunctionalityAccess,
    hasAuthority,
  }
}

// Hook for checking specific permission types
export function useModulePermission(userId: string, moduleId: string) {
  const { hasModuleAccess, loading } = useEnhancedPermission(userId)
  return { hasAccess: hasModuleAccess(moduleId), loading }
}

export function useRoutePermission(userId: string, routeId: string) {
  const { hasRouteAccess, loading } = useEnhancedPermission(userId)
  return { hasAccess: hasRouteAccess(routeId), loading }
}

export function useFunctionalityPermission(userId: string, functionalityId: string) {
  const { hasFunctionalityAccess, loading } = useEnhancedPermission(userId)
  return { hasAccess: hasFunctionalityAccess(functionalityId), loading }
}
