"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Search,
  Settings,
  Info,
} from "lucide-react"

interface FunctionalityPermissionsProps {
  selectedRole: string
}

export function FunctionalityPermissions({ selectedRole }: FunctionalityPermissionsProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    // Button permissions
    "btn.create": true,
    "btn.edit": true,
    "btn.delete": false,
    "btn.save": true,
    "btn.export": false,
    "btn.import": false,
    "btn.refresh": true,
    "btn.settings": false,

    // Form field permissions
    "field.equipment-name": true,
    "field.tag-01": true,
    "field.tag-02": false,
    "field.equipment-type": true,
    "field.location": true,
    "field.status": false,

    // View permissions
    "view.table": true,
    "view.details": true,
    "view.history": false,
    "view.analytics": false,

    // Action permissions
    "action.filter": true,
    "action.search": true,
    "action.sort": true,
    "action.bulk-operations": false,
    "action.advanced-settings": false,
  })

  const functionalityCategories = [
    {
      id: "buttons",
      name: "Button Actions",
      description: "Control access to action buttons",
      items: [
        { id: "btn.create", name: "Create/Add Button", icon: Plus, description: "Allow creating new records" },
        { id: "btn.edit", name: "Edit Button", icon: Edit, description: "Allow editing existing records" },
        { id: "btn.delete", name: "Delete Button", icon: Trash2, description: "Allow deleting records" },
        { id: "btn.save", name: "Save Button", icon: Save, description: "Allow saving changes" },
        { id: "btn.export", name: "Export Button", icon: Download, description: "Allow exporting data" },
        { id: "btn.import", name: "Import Button", icon: Upload, description: "Allow importing data" },
        { id: "btn.refresh", name: "Refresh Button", icon: RefreshCw, description: "Allow refreshing data" },
        { id: "btn.settings", name: "Settings Button", icon: Settings, description: "Allow accessing settings" },
      ],
    },
    {
      id: "fields",
      name: "Form Fields",
      description: "Control visibility and editability of form fields",
      items: [
        { id: "field.equipment-name", name: "Equipment Name", icon: Edit, description: "Equipment name input field" },
        { id: "field.tag-01", name: "Tag 01", icon: Edit, description: "Primary tag field" },
        { id: "field.tag-02", name: "Tag 02", icon: Edit, description: "Secondary tag field" },
        { id: "field.equipment-type", name: "Equipment Type", icon: Edit, description: "Equipment type selector" },
        { id: "field.location", name: "Location", icon: Edit, description: "Location field" },
        { id: "field.status", name: "Status", icon: Edit, description: "Status field" },
      ],
    },
    {
      id: "views",
      name: "View Components",
      description: "Control access to different view components",
      items: [
        { id: "view.table", name: "Table View", icon: Eye, description: "Main data table" },
        { id: "view.details", name: "Details Panel", icon: Eye, description: "Detailed information panel" },
        { id: "view.history", name: "History View", icon: Eye, description: "Historical data view" },
        { id: "view.analytics", name: "Analytics View", icon: Eye, description: "Analytics and charts" },
      ],
    },
    {
      id: "actions",
      name: "User Actions",
      description: "Control access to user interaction features",
      items: [
        { id: "action.filter", name: "Filter Data", icon: Filter, description: "Allow filtering data" },
        { id: "action.search", name: "Search", icon: Search, description: "Allow searching records" },
        { id: "action.sort", name: "Sort Data", icon: RefreshCw, description: "Allow sorting data" },
        { id: "action.bulk-operations", name: "Bulk Operations", icon: Edit, description: "Allow bulk actions" },
        {
          id: "action.advanced-settings",
          name: "Advanced Settings",
          icon: Settings,
          description: "Access advanced features",
        },
      ],
    },
  ]

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: enabled,
    }))
  }

  const getEnabledCount = (categoryId: string) => {
    const category = functionalityCategories.find((c) => c.id === categoryId)
    if (!category) return 0
    return category.items.filter((item) => permissions[item.id]).length
  }

  if (!selectedRole) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please select a role from the dropdown above to configure functionality permissions.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Level 3: Functionality Permissions</h2>
          <p className="text-muted-foreground">Control specific functionality within pages</p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure granular permissions for buttons, form fields, views, and user actions within each page. These
          permissions control what users can see and interact with at the component level.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="buttons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="fields">Form Fields</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {functionalityCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {getEnabledCount(category.id)} of {category.items.length} enabled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {category.items.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                              {item.name}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={item.id}
                            checked={permissions[item.id]}
                            onCheckedChange={(checked) => handlePermissionChange(item.id, checked)}
                          />
                          {permissions[item.id] ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-300" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
