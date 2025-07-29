"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { permissionService } from "../services/permissionService"
import type { User, Role, RolePermissions } from "../types/permissions"
import { Shield, Settings, Eye, Save } from "lucide-react"

export function FunctionalPermissionManagement() {
  const [activeTab, setActiveTab] = useState("modules")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<RolePermissions | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole)
    }
  }, [selectedRole])

  const loadInitialData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([permissionService.getUsers(), permissionService.getRoles()])
      setUsers(usersData)
      setRoles(rolesData)
    } catch (error) {
      console.error("Failed to load initial data:", error)
    }
  }

  const loadRolePermissions = async (roleId: string) => {
    try {
      setLoading(true)
      const rolePermissions = await permissionService.getRolePermissions(roleId)
      setPermissions(rolePermissions)
    } catch (error) {
      console.error("Failed to load role permissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = (type: "modules" | "routes" | "functionality", key: string, value: boolean) => {
    if (!permissions) return

    setPermissions((prev) => ({
      ...prev!,
      [type]: {
        ...prev![type],
        [key]: value,
      },
    }))
  }

  const savePermissions = async () => {
    if (!permissions || !selectedRole) return

    try {
      setLoading(true)
      await permissionService.updateRolePermissions(selectedRole, permissions)
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      })
    } catch (error) {
      console.error("Failed to save permissions:", error)
      toast({
        title: "Error",
        description: "Failed to save permissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const modules = [
    { id: "energy-management", name: "Energy Management" },
    { id: "maintenance", name: "Maintenance" },
    { id: "analytics", name: "Analytics" },
    { id: "alarms", name: "Alarms" },
    { id: "data-io", name: "Data IO" },
    { id: "building-trend", name: "Building Trend" },
    { id: "prediction", name: "Prediction" },
    { id: "summary", name: "Summary" },
    { id: "dashboard-settings", name: "Dashboard Settings" },
    { id: "settings", name: "Settings" },
  ]

  const routes = [
    { id: "dashboard-settings", name: "Dashboard Settings" },
    { id: "dashboard-settings.bot-control", name: "Bot Control" },
    { id: "dashboard-settings.bot-control.configuration", name: "Configuration" },
    { id: "dashboard-settings.bot-control.monitoring", name: "Monitoring" },
    { id: "dashboard-settings.backend-controls", name: "Backend Controls" },
    { id: "dashboard-settings.backend-controls.bacnet-engine", name: "BACnet Engine" },
    { id: "dashboard-settings.backend-controls.tags", name: "Tags" },
    { id: "dashboard-settings.backend-controls.tags.equipment", name: "Equipment Tag" },
    { id: "dashboard-settings.backend-controls.tags.area", name: "Area Tag" },
    { id: "dashboard-settings.backend-controls.tags.datapoint", name: "Datapoint Tagging" },
    { id: "settings", name: "Settings" },
    { id: "settings.general", name: "General Settings" },
    { id: "settings.security", name: "Security Settings" },
  ]

  const functionality = [
    { id: "btn.create", name: "Create Button" },
    { id: "btn.edit", name: "Edit Button" },
    { id: "btn.delete", name: "Delete Button" },
    { id: "btn.save", name: "Save Button" },
    { id: "btn.export", name: "Export Button" },
    { id: "btn.import", name: "Import Button" },
    { id: "field.equipment-name", name: "Equipment Name Field" },
    { id: "field.tag-01", name: "Tag 01 Field" },
    { id: "field.tag-02", name: "Tag 02 Field" },
    { id: "view.table", name: "Table View" },
    { id: "view.details", name: "Details View" },
    { id: "action.filter", name: "Filter Action" },
    { id: "action.search", name: "Search Action" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Functional Permission Management</h1>
          <p className="text-muted-foreground">Configure user roles and permissions with localStorage persistence</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select role to configure" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <Badge className={role.color}>{role.name}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={savePermissions} disabled={!selectedRole || loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {selectedRole && permissions && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Level 1: Modules
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Level 2: Routes
            </TabsTrigger>
            <TabsTrigger value="functionality" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Level 3: Functionality
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <CardTitle>Module Permissions</CardTitle>
                <CardDescription>Control sidebar module visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor={module.id} className="text-sm font-medium cursor-pointer">
                        {module.name}
                      </Label>
                      <Switch
                        id={module.id}
                        checked={permissions.modules[module.id] || false}
                        onCheckedChange={(checked) => handlePermissionChange("modules", module.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Route Permissions</CardTitle>
                <CardDescription>Control access to specific navigation routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={route.id} className="text-sm font-medium cursor-pointer">
                          {route.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">{route.id}</p>
                      </div>
                      <Switch
                        id={route.id}
                        checked={permissions.routes[route.id] || false}
                        onCheckedChange={(checked) => handlePermissionChange("routes", route.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functionality">
            <Card>
              <CardHeader>
                <CardTitle>Functionality Permissions</CardTitle>
                <CardDescription>Control specific functionality within pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {functionality.map((func) => (
                    <div key={func.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor={func.id} className="text-sm font-medium cursor-pointer">
                        {func.name}
                      </Label>
                      <Switch
                        id={func.id}
                        checked={permissions.functionality[func.id] || false}
                        onCheckedChange={(checked) => handlePermissionChange("functionality", func.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
