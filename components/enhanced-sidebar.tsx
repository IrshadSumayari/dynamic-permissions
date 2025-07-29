"use client"

import { useState, useEffect } from "react"
import { useEnhancedPermission } from "../hooks/useEnhancedPermission"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BarChart3, Settings, Activity, AlertTriangle, Database, TrendingUp, Brain, FileText } from "lucide-react"

interface SidebarModule {
  id: string
  name: string
  path: string
  icon: any
  authority: string[]
}

const sidebarModules: SidebarModule[] = [
  {
    id: "energy-management",
    name: "Energy Management",
    path: "/energy-management",
    icon: Activity,
    authority: ["energy-management"],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    path: "/maintenance",
    icon: Settings,
    authority: ["maintenance"],
  },
  {
    id: "analytics",
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    authority: ["analytics"],
  },
  {
    id: "alarms",
    name: "Alarms",
    path: "/alarms",
    icon: AlertTriangle,
    authority: ["alarms"],
  },
  {
    id: "data-io",
    name: "Data IO",
    path: "/data-io",
    icon: Database,
    authority: ["data-io"],
  },
  {
    id: "building-trend",
    name: "Building Trend",
    path: "/building-trend",
    icon: TrendingUp,
    authority: ["building-trend"],
  },
  {
    id: "prediction",
    name: "Prediction",
    path: "/prediction",
    icon: Brain,
    authority: ["prediction"],
  },
  {
    id: "summary",
    name: "Summary",
    path: "/summary",
    icon: FileText,
    authority: ["summary"],
  },
  {
    id: "dashboard-settings",
    name: "Dashboard Settings",
    path: "/dashboard-settings",
    icon: Settings,
    authority: ["dashboard-settings"],
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    icon: Settings,
    authority: ["settings"],
  },
]

interface EnhancedSidebarProps {
  userId: string
  currentPath?: string
}

export function EnhancedSidebar({ userId, currentPath }: EnhancedSidebarProps) {
  const { hasModuleAccess, loading } = useEnhancedPermission(userId)
  const [visibleModules, setVisibleModules] = useState<SidebarModule[]>([])

  useEffect(() => {
    if (!loading) {
      const filtered = sidebarModules.filter((module) => hasModuleAccess(module.id))
      setVisibleModules(filtered)
    }
  }, [hasModuleAccess, loading])

  if (loading) {
    return <div>Loading sidebar...</div>
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleModules.map((module) => {
                const IconComponent = module.icon
                const isActive = currentPath === module.path

                return (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={module.path}>
                        <IconComponent className="h-4 w-4" />
                        <span>{module.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// Usage example component
export function SidebarExample() {
  const [currentUser] = useState("1") // This would come from your auth state
  const [currentPath] = useState("/energy-management")

  return (
    <SidebarProvider>
      <EnhancedSidebar userId={currentUser} currentPath={currentPath} />
      <main className="flex-1">
        <SidebarTrigger />
        <div className="p-4">
          <h1>Main Content</h1>
          <p>Your main application content goes here</p>
        </div>
      </main>
    </SidebarProvider>
  )
}
