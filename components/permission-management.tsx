"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserManagement } from "./user-management"
import { ModulePermissions } from "./module-permissions"
import { RoutePermissions } from "./route-permissions"
import { FunctionalityPermissions } from "./functionality-permissions"
import { Users, Shield, Settings, Eye } from "lucide-react"

export function PermissionManagement() {
  const [activeTab, setActiveTab] = useState("users")
  const [selectedRole, setSelectedRole] = useState<string>("")

  const roles = [
    { id: "admin", name: "Administrator", color: "bg-red-100 text-red-800" },
    { id: "manager", name: "Manager", color: "bg-blue-100 text-blue-800" },
    { id: "operator", name: "Operator", color: "bg-green-100 text-green-800" },
    { id: "viewer", name: "Viewer", color: "bg-gray-100 text-gray-800" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground">Configure user roles and permissions across all system levels</p>
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
          <Button>Save Changes</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
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

        <TabsContent value="users" className="space-y-6">
          <UserManagement selectedRole={selectedRole} />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <ModulePermissions selectedRole={selectedRole} />
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <RoutePermissions selectedRole={selectedRole} />
        </TabsContent>

        <TabsContent value="functionality" className="space-y-6">
          <FunctionalityPermissions selectedRole={selectedRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
