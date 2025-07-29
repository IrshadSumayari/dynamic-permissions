"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart3,
  Settings,
  Activity,
  AlertTriangle,
  Database,
  TrendingUp,
  Brain,
  FileText,
  Eye,
  Info,
} from "lucide-react"

interface ModulePermissionsProps {
  selectedRole: string
}

export function ModulePermissions({ selectedRole }: ModulePermissionsProps) {
  const [permissions, setPermissions] = useState({
    "energy-management": true,
    maintenance: true,
    analytics: false,
    alarms: true,
    "data-io": false,
    "building-trend": true,
    prediction: false,
    summary: true,
    "dashboard-settings": false,
    settings: false,
  })

  const modules = [
    {
      id: "energy-management",
      name: "Energy Management",
      description: "Monitor and control energy consumption",
      icon: Activity,
      category: "Core",
    },
    {
      id: "maintenance",
      name: "Maintenance",
      description: "Equipment maintenance and scheduling",
      icon: Settings,
      category: "Operations",
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Data analysis and reporting tools",
      icon: BarChart3,
      category: "Analytics",
    },
    {
      id: "alarms",
      name: "Alarms",
      description: "System alerts and notifications",
      icon: AlertTriangle,
      category: "Monitoring",
    },
    {
      id: "data-io",
      name: "Data IO",
      description: "Data import and export functionality",
      icon: Database,
      category: "Data",
    },
    {
      id: "building-trend",
      name: "Building Trend",
      description: "Historical trend analysis",
      icon: TrendingUp,
      category: "Analytics",
    },
    {
      id: "prediction",
      name: "Prediction",
      description: "Predictive analytics and forecasting",
      icon: Brain,
      category: "AI/ML",
    },
    {
      id: "summary",
      name: "Summary",
      description: "System overview and summaries",
      icon: FileText,
      category: "Reporting",
    },
    {
      id: "dashboard-settings",
      name: "Dashboard Settings",
      description: "Configure dashboard layout and preferences",
      icon: Settings,
      category: "Configuration",
    },
    {
      id: "settings",
      name: "Settings",
      description: "System configuration and preferences",
      icon: Settings,
      category: "Administration",
    },
  ]

  const categories = [...new Set(modules.map((m) => m.category))]

  const handlePermissionChange = (moduleId: string, enabled: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: enabled,
    }))
  }

  const getEnabledCount = () => {
    return Object.values(permissions).filter(Boolean).length
  }

  if (!selectedRole) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please select a role from the dropdown above to configure module permissions.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Level 1: Module Permissions</h2>
          <p className="text-muted-foreground">Control sidebar module visibility</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {getEnabledCount()} of {modules.length} modules enabled
        </Badge>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
              <CardDescription>Configure access to {category.toLowerCase()} modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {modules
                  .filter((module) => module.category === category)
                  .map((module) => {
                    const IconComponent = module.icon
                    return (
                      <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <Label htmlFor={module.id} className="text-sm font-medium cursor-pointer">
                              {module.name}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={module.id}
                            checked={permissions[module.id as keyof typeof permissions]}
                            onCheckedChange={(checked) => handlePermissionChange(module.id, checked)}
                          />
                          <Eye
                            className={`h-4 w-4 ${permissions[module.id as keyof typeof permissions] ? "text-green-500" : "text-gray-300"}`}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
