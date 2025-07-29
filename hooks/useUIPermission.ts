"use client"

import { useState, useEffect, useMemo } from "react"

// Enhanced Permission Hook for UI Elements
export function useUIPermission(userId: string) {
  const [permissions, setPermissions] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock loading user permissions
    const loadPermissions = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Mock permissions based on userId
      const mockPermissions = {
        "1": {
          // Admin
          uiElements: {
            "dashboard-settings.bot-control.config-modal": true,
            "dashboard-settings.bot-control.monitoring-toggle": true,
            "dashboard-settings.bot-control.advanced-settings": true,
            "energy-management.dashboard.chart-toggle": true,
            "energy-management.dashboard.export-modal": true,
            "energy-management.dashboard.real-time-toggle": true,
            "energy-management.dashboard.advanced-filters": true,
          },
        },
        "2": {
          // Manager
          uiElements: {
            "dashboard-settings.bot-control.config-modal": true,
            "dashboard-settings.bot-control.monitoring-toggle": true,
            "dashboard-settings.bot-control.advanced-settings": false,
            "energy-management.dashboard.chart-toggle": true,
            "energy-management.dashboard.export-modal": true,
            "energy-management.dashboard.real-time-toggle": true,
            "energy-management.dashboard.advanced-filters": false,
          },
        },
        "3": {
          // Operator
          uiElements: {
            "energy-management.dashboard.chart-toggle": true,
            "energy-management.dashboard.export-modal": false,
            "energy-management.dashboard.real-time-toggle": true,
            "energy-management.dashboard.advanced-filters": false,
          },
        },
        "4": {
          // Viewer
          uiElements: {
            "energy-management.dashboard.chart-toggle": true,
            "energy-management.dashboard.export-modal": false,
            "energy-management.dashboard.real-time-toggle": false,
            "energy-management.dashboard.advanced-filters": false,
          },
        },
      }

      setPermissions(mockPermissions[userId as keyof typeof mockPermissions] || { uiElements: {} })
      setLoading(false)
    }

    if (userId) {
      loadPermissions()
    }
  }, [userId])

  // Check if user can access a specific UI element
  const canShowModal = useMemo(() => {
    return (modalId: string): boolean => {
      if (!permissions) return false
      return permissions.uiElements[modalId] || false
    }
  }, [permissions])

  const canShowToggle = useMemo(() => {
    return (toggleId: string): boolean => {
      if (!permissions) return false
      return permissions.uiElements[toggleId] || false
    }
  }, [permissions])

  const canShowConditionalUI = useMemo(() => {
    return (elementId: string): boolean => {
      if (!permissions) return false
      return permissions.uiElements[elementId] || false
    }
  }, [permissions])

  const canShowComponent = useMemo(() => {
    return (componentId: string): boolean => {
      if (!permissions) return false
      return permissions.uiElements[componentId] || false
    }
  }, [permissions])

  const canPerformAction = useMemo(() => {
    return (actionId: string): boolean => {
      if (!permissions) return false
      return permissions.uiElements[actionId] || false
    }
  }, [permissions])

  // Generic permission checker
  const hasUIAccess = useMemo(() => {
    return (elementId: string): boolean => {
      if (!permissions) return false
      return permissions.uiElements[elementId] || false
    }
  }, [permissions])

  return {
    permissions,
    loading,
    canShowModal,
    canShowToggle,
    canShowConditionalUI,
    canShowComponent,
    canPerformAction,
    hasUIAccess,
  }
}
