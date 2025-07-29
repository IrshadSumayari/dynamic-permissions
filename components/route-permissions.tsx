"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Bot,
  Server,
  Users,
  Tag,
  Cog,
  Database,
  Monitor,
  Link,
  Zap,
  Clock,
  Shield,
  HardDrive,
  EyeOff,
  Info,
} from "lucide-react"

interface RoutePermissionsProps {
  selectedRole: string
}

export function RoutePermissions({ selectedRole }: RoutePermissionsProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(["dashboard-settings"])
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    // Dashboard Settings routes
    "dashboard-settings": true,
    "dashboard-settings.bot-control": true,
    "dashboard-settings.bot-control.configuration": true,
    "dashboard-settings.bot-control.monitoring": false,
    "dashboard-settings.backend-controls": true,
    "dashboard-settings.backend-controls.bacnet-engine": true,
    "dashboard-settings.backend-controls.bacnet-engine.devices": true,
    "dashboard-settings.backend-controls.bacnet-engine.objects": true,
    "dashboard-settings.backend-controls.bacnet-engine.settings": false,
    "dashboard-settings.backend-controls.tags": true,
    "dashboard-settings.backend-controls.tags.equipment": true,
    "dashboard-settings.backend-controls.tags.area": false,
    "dashboard-settings.backend-controls.tags.datapoint": true,
    "dashboard-settings.backend-controls.services-monitoring": true,
    "dashboard-settings.backend-controls.relation-builder": false,
    "dashboard-settings.backend-controls.energy": true,
    "dashboard-settings.backend-controls.cron-jobs": false,
    "dashboard-settings.backend-controls.cov-settings": true,
    "dashboard-settings.backend-controls.site-setting": false,
    "dashboard-settings.backend-controls.reboot-device": false,
    "dashboard-settings.backend-controls.object-excluder": true,
    "dashboard-settings.bot-zones": true,
    "dashboard-settings.user-management": false,
    // Settings routes
    settings: false,
    "settings.general": false,
    "settings.security": false,
    "settings.integrations": false,
    "settings.backup": false,
  })

  const routeStructure = [
    {
      id: "dashboard-settings",
      name: "Dashboard Settings",
      icon: Settings,
      children: [
        {
          id: "bot-control",
          name: "Bot Control",
          icon: Bot,
          children: [
            { id: "configuration", name: "Configuration", icon: Cog },
            { id: "monitoring", name: "Monitoring", icon: Monitor },
          ],
        },
        {
          id: "backend-controls",
          name: "Backend Controls",
          icon: Server,
          children: [
            {
              id: "bacnet-engine",
              name: "BACnet Engine",
              icon: Database,
              children: [
                { id: "devices", name: "Devices", icon: HardDrive },
                { id: "objects", name: "Objects", icon: Database },
                { id: "settings", name: "Settings", icon: Settings },
              ],
            },
            {
              id: "tags",
              name: "Tags",
              icon: Tag,
              children: [
                { id: "equipment", name: "Equipment Tag", icon: Tag },
                { id: "area", name: "Area Tag", icon: Tag },
                { id: "datapoint", name: "Datapoint Tagging", icon: Tag },
              ],
            },
            { id: "services-monitoring", name: "Services Monitoring", icon: Monitor },
            { id: "relation-builder", name: "Relation Builder", icon: Link },
            { id: "energy", name: "Energy", icon: Zap },
            { id: "cron-jobs", name: "Cron Jobs", icon: Clock },
            { id: "cov-settings", name: "COV Settings", icon: Settings },
            { id: "site-setting", name: "Site Setting", icon: Settings },
            { id: "reboot-device", name: "Reboot Device", icon: HardDrive },
            { id: "object-excluder", name: "Object Excluder", icon: EyeOff },
          ],
        },
        {
          id: "bot-zones",
          name: "Bot Zones",
          icon: Shield,
        },
        {
          id: "user-management",
          name: "User Management",
          icon: Users,
        },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      children: [
        { id: "general", name: "General", icon: Settings },
        { id: "security", name: "Security", icon: Shield },
        { id: "integrations", name: "Integrations", icon: Link },
        { id: "backup", name: "Backup & Restore", icon: HardDrive },
      ],
    },
  ]

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handlePermissionChange = (routeId: string, enabled: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [routeId]: enabled,
    }))
  }

  const getRouteKey = (parentKeys: string[], routeId: string) => {
    return [...parentKeys, routeId].join(".")
  }

  const isRouteEnabled = (routeKey: string) => {
    return permissions[routeKey] || false
  }

  const renderRoute = (route: any, parentKeys: string[] = [], level = 0) => {
    const routeKey = getRouteKey(parentKeys, route.id)
    const IconComponent = route.icon
    const hasChildren = route.children && route.children.length > 0
    const isExpanded = expandedModules.includes(routeKey)

    return (
      <div key={routeKey} className={`${level > 0 ? "ml-6 border-l border-gray-200 pl-4" : ""}`}>
        <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
          <div className="flex items-center gap-3">
            {hasChildren && (
              <Button variant="ghost" size="sm" onClick={() => toggleModule(routeKey)} className="p-0 h-auto">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            {!hasChildren && <div className="w-4" />}
            <IconComponent className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label htmlFor={routeKey} className="text-sm font-medium cursor-pointer">
                {route.name}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Level {level + 1}
                </Badge>
                <span className="text-xs text-muted-foreground">{routeKey}</span>
              </div>
            </div>
          </div>
          <Switch
            id={routeKey}
            checked={isRouteEnabled(routeKey)}
            onCheckedChange={(checked) => handlePermissionChange(routeKey, checked)}
          />
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {route.children.map((child: any) => renderRoute(child, [...parentKeys, route.id], level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (!selectedRole) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please select a role from the dropdown above to configure route permissions.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Level 2: Route Permissions</h2>
          <p className="text-muted-foreground">Control access to specific navigation routes and nested screens</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExpandedModules(routeStructure.map((r) => r.id))}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpandedModules([])}>
            Collapse All
          </Button>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This interface dynamically handles nested routes of varying depths. Some modules have 2-3 levels, while others
          may have 6-7 nested screens. Use the expand/collapse controls to navigate the hierarchy.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">{routeStructure.map((module) => renderRoute(module))}</div>
    </div>
  )
}
