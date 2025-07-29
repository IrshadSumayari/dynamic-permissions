import type React from "react"
import type { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { useEnhancedPermission } from "../hooks/useEnhancedPermission"

type EnhancedAuthorityGuardProps = PropsWithChildren<{
  userId: string
  authority?: string[]
  moduleId?: string
  routeId?: string
  functionalityId?: string
  fallback?: React.ReactNode
}>

export const EnhancedAuthorityGuard = (props: EnhancedAuthorityGuardProps) => {
  const {
    userId,
    authority = [],
    moduleId,
    routeId,
    functionalityId,
    children,
    fallback = <Navigate to="/access-denied" />,
  } = props

  const { hasAuthority, hasModuleAccess, hasRouteAccess, hasFunctionalityAccess, loading } =
    useEnhancedPermission(userId)

  if (loading) {
    return <div>Loading permissions...</div>
  }

  // Check different types of permissions
  let hasAccess = true

  // Check traditional authority (backward compatibility)
  if (authority.length > 0) {
    hasAccess = hasAccess && hasAuthority(authority)
  }

  // Check module access
  if (moduleId) {
    hasAccess = hasAccess && hasModuleAccess(moduleId)
  }

  // Check route access
  if (routeId) {
    hasAccess = hasAccess && hasRouteAccess(routeId)
  }

  // Check functionality access
  if (functionalityId) {
    hasAccess = hasAccess && hasFunctionalityAccess(functionalityId)
  }

  return <>{hasAccess ? children : fallback}</>
}

// Enhanced version of your AuthorityCheck component
type EnhancedAuthorityCheckProps = PropsWithChildren<{
  userId: string
  authority?: string[]
  moduleId?: string
  routeId?: string
  functionalityId?: string
}>

export const EnhancedAuthorityCheck = (props: EnhancedAuthorityCheckProps) => {
  const { userId, authority = [], moduleId, routeId, functionalityId, children } = props

  const { hasAuthority, hasModuleAccess, hasRouteAccess, hasFunctionalityAccess, loading } =
    useEnhancedPermission(userId)

  if (loading) {
    return null
  }

  // Check different types of permissions
  let hasAccess = true

  // Check traditional authority (backward compatibility)
  if (authority.length > 0) {
    hasAccess = hasAccess && hasAuthority(authority)
  }

  // Check module access
  if (moduleId) {
    hasAccess = hasAccess && hasModuleAccess(moduleId)
  }

  // Check route access
  if (routeId) {
    hasAccess = hasAccess && hasRouteAccess(routeId)
  }

  // Check functionality access
  if (functionalityId) {
    hasAccess = hasAccess && hasFunctionalityAccess(functionalityId)
  }

  return <>{hasAccess ? children : null}</>
}
