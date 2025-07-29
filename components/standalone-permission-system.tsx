"use client"

import { useState, useEffect, useMemo } from "react"

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

interface Role {
  id: string
  name: string
  color: string
}

interface RolePermissions {
  roleId: string
  modules: Record<string, boolean>
  routes: Record<string, boolean>
  functionality: Record<string, boolean>
}

// Mock Data Service
class PermissionService {
  private STORAGE_KEY = "permission_system_data"

  private mockUsers: User[] = [
    { id: "0", name: "Super Admin", email: "superadmin@example.com", role: "superadmin", status: "active" },
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "manager", status: "active" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "operator", status: "active" },
    { id: "4", name: "Alice Brown", email: "alice@example.com", role: "viewer", status: "active" },
  ]

  private mockRoles: Role[] = [
    { id: "superadmin", name: "Super Administrator", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { id: "admin", name: "Administrator", color: "bg-red-100 text-red-800 border-red-200" },
    { id: "manager", name: "Manager", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { id: "operator", name: "Operator", color: "bg-green-100 text-green-800 border-green-200" },
    { id: "viewer", name: "Viewer", color: "bg-gray-100 text-gray-800 border-gray-200" },
  ]

  private mockPermissions: Record<string, RolePermissions> = {
    superadmin: {
      roleId: "superadmin",
      modules: {
        dashboard: true,
        "energy-management": true,
        maintenance: true,
        analytics: true,
        alarms: true,
        "data-io": true,
        "building-trend": true,
        prediction: true,
        summary: true,
        "dashboard-settings": true,
        settings: true,
        "role-management": true,
      },
      routes: {
        dashboard: true,
        "dashboard.esg-overview": true,
        "dashboard.control-status": true,
        "dashboard.equipment-status": true,
        "dashboard.equipment-scheduling": true,
        "dashboard-settings": true,
        "dashboard-settings.bot-control": true,
        "dashboard-settings.bot-control.configuration": true,
        "dashboard-settings.bot-control.monitoring": true,
        "dashboard-settings.backend-controls": true,
        "dashboard-settings.backend-controls.bacnet-engine": true,
        "dashboard-settings.backend-controls.tags": true,
        "dashboard-settings.backend-controls.tags.equipment": true,
        "dashboard-settings.backend-controls.tags.area": true,
        "dashboard-settings.backend-controls.tags.datapoint": true,
        settings: true,
        "settings.general": true,
        "settings.security": true,
        "settings.role-management": true,
      },
      functionality: {
        "btn.create": true,
        "btn.edit": true,
        "btn.delete": true,
        "btn.save": true,
        "btn.export": true,
        "btn.import": true,
        "btn.configure": true,
        "field.equipment-name": true,
        "field.tag-01": true,
        "field.tag-02": true,
        "view.table": true,
        "view.details": true,
        "view.charts": true,
        "action.filter": true,
        "action.search": true,
        "action.create-role": true,
        "action.edit-role": true,
        "action.delete-role": true,
      },
    },
    admin: {
      roleId: "admin",
      modules: {
        dashboard: true,
        "energy-management": true,
        maintenance: true,
        analytics: true,
        alarms: true,
        "data-io": true,
        "building-trend": true,
        prediction: true,
        summary: true,
        "dashboard-settings": true,
        settings: true,
        "role-management": false,
      },
      routes: {
        dashboard: true,
        "dashboard.esg-overview": true,
        "dashboard.control-status": true,
        "dashboard.equipment-status": true,
        "dashboard.equipment-scheduling": true,
        "dashboard-settings": true,
        "dashboard-settings.bot-control": true,
        "dashboard-settings.bot-control.configuration": true,
        "dashboard-settings.bot-control.monitoring": true,
        "dashboard-settings.backend-controls": true,
        "dashboard-settings.backend-controls.bacnet-engine": true,
        "dashboard-settings.backend-controls.tags": true,
        "dashboard-settings.backend-controls.tags.equipment": true,
        "dashboard-settings.backend-controls.tags.area": true,
        "dashboard-settings.backend-controls.tags.datapoint": true,
        settings: true,
        "settings.general": true,
        "settings.security": true,
        "settings.role-management": false,
      },
      functionality: {
        "btn.create": true,
        "btn.edit": true,
        "btn.delete": true,
        "btn.save": true,
        "btn.export": true,
        "btn.import": true,
        "btn.configure": true,
        "field.equipment-name": true,
        "field.tag-01": true,
        "field.tag-02": true,
        "view.table": true,
        "view.details": true,
        "view.charts": true,
        "action.filter": true,
        "action.search": true,
        "action.create-role": false,
        "action.edit-role": false,
        "action.delete-role": false,
      },
    },
    manager: {
      roleId: "manager",
      modules: {
        dashboard: true,
        "energy-management": true,
        maintenance: true,
        analytics: true,
        alarms: true,
        "data-io": false,
        "building-trend": true,
        prediction: false,
        summary: true,
        "dashboard-settings": true,
        settings: false,
        "role-management": false,
      },
      routes: {
        dashboard: true,
        "dashboard.esg-overview": true,
        "dashboard.control-status": true,
        "dashboard.equipment-status": true,
        "dashboard.equipment-scheduling": true,
        "dashboard-settings": true,
        "dashboard-settings.bot-control": true,
        "dashboard-settings.bot-control.configuration": true,
        "dashboard-settings.bot-control.monitoring": false,
        "dashboard-settings.backend-controls": true,
        "dashboard-settings.backend-controls.bacnet-engine": false,
        "dashboard-settings.backend-controls.tags": true,
        "dashboard-settings.backend-controls.tags.equipment": true,
        "dashboard-settings.backend-controls.tags.area": false,
        "dashboard-settings.backend-controls.tags.datapoint": false,
        settings: false,
        "settings.general": false,
        "settings.security": false,
        "settings.role-management": false,
      },
      functionality: {
        "btn.create": true,
        "btn.edit": true,
        "btn.delete": false,
        "btn.save": true,
        "btn.export": true,
        "btn.import": false,
        "btn.configure": false,
        "field.equipment-name": true,
        "field.tag-01": true,
        "field.tag-02": false,
        "view.table": true,
        "view.details": true,
        "view.charts": true,
        "action.filter": true,
        "action.search": true,
        "action.create-role": false,
        "action.edit-role": false,
        "action.delete-role": false,
      },
    },
    operator: {
      roleId: "operator",
      modules: {
        dashboard: false,
        "energy-management": true,
        maintenance: true,
        analytics: false,
        alarms: true,
        "data-io": false,
        "building-trend": false,
        prediction: false,
        summary: true,
        "dashboard-settings": false,
        settings: false,
        "role-management": false,
      },
      routes: {
        dashboard: false,
        "dashboard.esg-overview": false,
        "dashboard.control-status": false,
        "dashboard.equipment-status": false,
        "dashboard.equipment-scheduling": false,
        "dashboard-settings": false,
        settings: false,
        "settings.general": false,
        "settings.security": false,
        "settings.role-management": false,
      },
      functionality: {
        "btn.create": false,
        "btn.edit": true,
        "btn.delete": false,
        "btn.save": true,
        "btn.export": false,
        "btn.import": false,
        "btn.configure": false,
        "field.equipment-name": true,
        "field.tag-01": true,
        "field.tag-02": false,
        "view.table": true,
        "view.details": false,
        "view.charts": false,
        "action.filter": true,
        "action.search": true,
        "action.create-role": false,
        "action.edit-role": false,
        "action.delete-role": false,
      },
    },
    viewer: {
      roleId: "viewer",
      modules: {
        dashboard: false,
        "energy-management": true,
        maintenance: false,
        analytics: false,
        alarms: true,
        "data-io": false,
        "building-trend": false,
        prediction: false,
        summary: true,
        "dashboard-settings": false,
        settings: false,
        "role-management": false,
      },
      routes: {
        dashboard: false,
        "dashboard.esg-overview": false,
        "dashboard.control-status": false,
        "dashboard.equipment-status": false,
        "dashboard.equipment-scheduling": false,
        "dashboard-settings": false,
        settings: false,
        "settings.general": false,
        "settings.security": false,
        "settings.role-management": false,
      },
      functionality: {
        "btn.create": false,
        "btn.edit": false,
        "btn.delete": false,
        "btn.save": false,
        "btn.export": false,
        "btn.import": false,
        "btn.configure": false,
        "field.equipment-name": false,
        "field.tag-01": false,
        "field.tag-02": false,
        "view.table": true,
        "view.details": true,
        "view.charts": false,
        "action.filter": true,
        "action.search": true,
        "action.create-role": false,
        "action.edit-role": false,
        "action.delete-role": false,
      },
    },
  }

  getStorageData() {
    if (typeof window === "undefined")
      return { users: this.mockUsers, roles: this.mockRoles, permissions: this.mockPermissions }

    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }

    const initialData = {
      users: this.mockUsers,
      roles: this.mockRoles,
      permissions: this.mockPermissions,
    }

    this.saveToStorage(initialData)
    return initialData
  }

  saveToStorage(data: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    }
  }

  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        resolve(data.users)
      }, 100)
    })
  }

  async getRoles(): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        resolve(data.roles)
      }, 100)
    })
  }

  async getRolePermissions(roleId: string): Promise<RolePermissions | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        resolve(data.permissions[roleId] || null)
      }, 100)
    })
  }

  async updateRolePermissions(roleId: string, permissions: Partial<RolePermissions>): Promise<RolePermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        data.permissions[roleId] = {
          ...data.permissions[roleId],
          ...permissions,
          roleId,
        }
        this.saveToStorage(data)
        resolve(data.permissions[roleId])
      }, 100)
    })
  }

  async getUserPermissions(userId: string): Promise<RolePermissions | null> {
    return new Promise(async (resolve) => {
      const users = await this.getUsers()
      const user = users.find((u) => u.id === userId)
      if (!user) {
        resolve(null)
        return
      }
      const permissions = await this.getRolePermissions(user.role)
      resolve(permissions)
    })
  }

  async createRole(role: Omit<Role, "id">): Promise<Role> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        const newRole: Role = {
          ...role,
          id: Date.now().toString(),
        }
        data.roles.push(newRole)

        // Create default permissions for new role
        data.permissions[newRole.id] = {
          roleId: newRole.id,
          modules: {},
          routes: {},
          functionality: {},
        }

        this.saveToStorage(data)
        resolve(newRole)
      }, 100)
    })
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = this.getStorageData()
        const roleIndex = data.roles.findIndex((r: Role) => r.id === id)
        if (roleIndex === -1) {
          reject(new Error("Role not found"))
          return
        }
        data.roles[roleIndex] = { ...data.roles[roleIndex], ...updates }
        this.saveToStorage(data)
        resolve(data.roles[roleIndex])
      }, 100)
    })
  }

  async deleteRole(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === "superadmin") {
          reject(new Error("Cannot delete superadmin role"))
          return
        }

        const data = this.getStorageData()

        // Reassign users with this role to viewer
        data.users = data.users.map((user: User) => (user.role === id ? { ...user, role: "viewer" } : user))

        // Remove role and its permissions
        data.roles = data.roles.filter((r: Role) => r.id !== id)
        delete data.permissions[id]

        this.saveToStorage(data)
        resolve()
      }, 100)
    })
  }
}

const permissionService = new PermissionService()

// Custom Components
const Button = ({ children, onClick, disabled, className = "", variant = "default" }: any) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }: any) => <div className={`p-6 pb-4 ${className}`}>{children}</div>

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
)

const CardContent = ({ children, className = "" }: any) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

const Badge = ({ children, className = "" }: any) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
)

const Switch = ({ checked, onCheckedChange, id, disabled = false }: any) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? "bg-blue-600" : "bg-gray-200"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
)

const Select = ({ value, onValueChange, children, className = "" }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {value || "Select option..."}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {children.map((child: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                onValueChange(child.props.value)
                setIsOpen(false)
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children }: any) => <div>{children}</div>

const Label = ({ children, htmlFor, className = "" }: any) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
)

const Alert = ({ children, className = "" }: any) => (
  <div className={`p-4 border border-blue-200 bg-blue-50 rounded-md ${className}`}>{children}</div>
)

const AlertDescription = ({ children }: any) => <p className="text-sm text-blue-800">{children}</p>

// Icons
const Eye = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
)

const EyeOff = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
)

const Save = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
)

const Settings = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Shield = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const Activity = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const BarChart3 = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const AlertTriangle = ({ className = "" }: any) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

// Main Permission Management Component
export function StandalonePermissionSystem() {
  const [activeTab, setActiveTab] = useState("demo")
  const [selectedRole, setSelectedRole] = useState<string>("admin")
  const [selectedUser, setSelectedUser] = useState<string>("1")
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<RolePermissions | null>(null)
  const [userPermissions, setUserPermissions] = useState<RolePermissions | null>(null)
  const [loading, setLoading] = useState(false)

  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleColor, setNewRoleColor] = useState("bg-gray-100 text-gray-800 border-gray-200")

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole)
    }
  }, [selectedRole])

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser)
    }
  }, [selectedUser])

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

  const loadUserPermissions = async (userId: string) => {
    try {
      const userPerms = await permissionService.getUserPermissions(userId)
      setUserPermissions(userPerms)
    } catch (error) {
      console.error("Failed to load user permissions:", error)
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
      alert("Permissions updated successfully!")
    } catch (error) {
      console.error("Failed to save permissions:", error)
      alert("Failed to save permissions")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return

    try {
      const newRole = await permissionService.createRole({
        name: newRoleName,
        color: newRoleColor,
      })
      setRoles((prev) => [...prev, newRole])
      setNewRoleName("")
      setShowRoleModal(false)
      alert("Role created successfully!")
    } catch (error) {
      alert("Failed to create role")
    }
  }

  const handleEditRole = async () => {
    if (!editingRole || !newRoleName.trim()) return

    try {
      const updatedRole = await permissionService.updateRole(editingRole.id, {
        name: newRoleName,
        color: newRoleColor,
      })
      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
      setEditingRole(null)
      setNewRoleName("")
      setShowRoleModal(false)
      alert("Role updated successfully!")
    } catch (error) {
      alert("Failed to update role")
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role? Users with this role will be reassigned to viewer."))
      return

    try {
      await permissionService.deleteRole(roleId)
      setRoles((prev) => prev.filter((r) => r.id !== roleId))
      if (selectedRole === roleId) {
        setSelectedRole("admin")
      }
      alert("Role deleted successfully!")
    } catch (error) {
      alert("Failed to delete role")
    }
  }

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: Activity },
    { id: "energy-management", name: "Energy Management", icon: Activity },
    { id: "maintenance", name: "Maintenance", icon: Settings },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "alarms", name: "Alarms", icon: AlertTriangle },
    { id: "data-io", name: "Data IO", icon: Settings },
    { id: "building-trend", name: "Building Trend", icon: BarChart3 },
    { id: "prediction", name: "Prediction", icon: Settings },
    { id: "summary", name: "Summary", icon: Settings },
    { id: "dashboard-settings", name: "Dashboard Settings", icon: Settings },
    { id: "settings", name: "Settings", icon: Settings },
    { id: "role-management", name: "Role Management", icon: Shield },
  ]

  const routes = [
    { id: "dashboard", name: "Dashboard", level: 0 },
    { id: "dashboard.esg-overview", name: "ESG Overview", level: 1 },
    { id: "dashboard.control-status", name: "Control Status", level: 1 },
    { id: "dashboard.equipment-status", name: "Equipment Status", level: 1 },
    { id: "dashboard.equipment-scheduling", name: "Equipment Scheduling", level: 1 },
    { id: "dashboard-settings", name: "Dashboard Settings", level: 0 },
    { id: "dashboard-settings.bot-control", name: "Bot Control", level: 1 },
    { id: "dashboard-settings.bot-control.configuration", name: "Configuration", level: 2 },
    { id: "dashboard-settings.bot-control.monitoring", name: "Monitoring", level: 2 },
    { id: "dashboard-settings.backend-controls", name: "Backend Controls", level: 1 },
    { id: "dashboard-settings.backend-controls.bacnet-engine", name: "BACnet Engine", level: 2 },
    { id: "dashboard-settings.backend-controls.tags", name: "Tags", level: 2 },
    { id: "dashboard-settings.backend-controls.tags.equipment", name: "Equipment Tag", level: 3 },
    { id: "dashboard-settings.backend-controls.tags.area", name: "Area Tag", level: 3 },
    { id: "dashboard-settings.backend-controls.tags.datapoint", name: "Datapoint Tag", level: 3 },
    { id: "settings", name: "Settings", level: 0 },
    { id: "settings.general", name: "General Settings", level: 1 },
    { id: "settings.security", name: "Security Settings", level: 1 },
    { id: "settings.role-management", name: "Role Management", level: 1 },
  ]

  const functionality = [
    { id: "btn.create", name: "Create Button", category: "Buttons" },
    { id: "btn.edit", name: "Edit Button", category: "Buttons" },
    { id: "btn.delete", name: "Delete Button", category: "Buttons" },
    { id: "btn.save", name: "Save Button", category: "Buttons" },
    { id: "btn.export", name: "Export Button", category: "Buttons" },
    { id: "btn.import", name: "Import Button", category: "Buttons" },
    { id: "btn.configure", name: "Configure Button", category: "Buttons" },
    { id: "field.equipment-name", name: "Equipment Name Field", category: "Form Fields" },
    { id: "field.tag-01", name: "Tag 01 Field", category: "Form Fields" },
    { id: "field.tag-02", name: "Tag 02 Field", category: "Form Fields" },
    { id: "view.table", name: "Table View", category: "Views" },
    { id: "view.details", name: "Details View", category: "Views" },
    { id: "view.charts", name: "Charts View", category: "Views" },
    { id: "action.filter", name: "Filter Action", category: "Actions" },
    { id: "action.search", name: "Search Action", category: "Actions" },
    { id: "action.create-role", name: "Create Role", category: "Role Management" },
    { id: "action.edit-role", name: "Edit Role", category: "Role Management" },
    { id: "action.delete-role", name: "Delete Role", category: "Role Management" },
  ]

  const visibleModules = useMemo(() => {
    if (!userPermissions) return []
    return modules.filter((module) => userPermissions.modules[module.id])
  }, [userPermissions])

  const currentUser = users.find((u) => u.id === selectedUser)
  const currentRole = roles.find((r) => r.id === currentUser?.role)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Management System</h1>
          <p className="text-gray-600">Manage roles and permissions with dashboard and settings access</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "demo", name: "Live Demo", icon: Eye },
            { id: "management", name: "Permission Management", icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <IconComponent />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Live Demo Tab */}
      {activeTab === "demo" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
            <label className="text-sm font-medium">Test as user:</label>
            <Select value={selectedUser} onValueChange={setSelectedUser} className="w-64">
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span>{user.name}</span>
                    {currentRole && <Badge className={currentRole.color}>{currentRole.name}</Badge>}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sidebar Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Modules (Level 1)</CardTitle>
                <CardDescription>
                  Modules visible to {currentUser?.name} ({currentRole?.name})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {visibleModules.length > 0 ? (
                    visibleModules.map((module) => {
                      const IconComponent = module.icon
                      return (
                        <div key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <IconComponent className="text-gray-600" />
                          <span className="text-sm font-medium">{module.name}</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No modules accessible</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Route Access Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Route Access (Level 2)</CardTitle>
                <CardDescription>Routes accessible to {currentUser?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {routes.map((route) => {
                    const hasAccess = userPermissions?.routes[route.id] || false
                    return (
                      <div
                        key={route.id}
                        className={`flex items-center gap-3 p-2 rounded ${
                          hasAccess ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                        }`}
                        style={{ marginLeft: `${route.level * 16}px` }}
                      >
                        {hasAccess ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">{route.name}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Functionality Demo */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Functionality Access (Level 3)</CardTitle>
                <CardDescription>Specific functionality accessible to {currentUser?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {["Buttons", "Form Fields", "Views", "Actions", "Role Management"].map((category) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-1">
                        {functionality
                          .filter((func) => func.category === category)
                          .map((func) => {
                            const hasAccess = userPermissions?.functionality[func.id] || false
                            return (
                              <div
                                key={func.id}
                                className={`flex items-center gap-2 p-2 rounded text-xs ${
                                  hasAccess ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-600"
                                }`}
                              >
                                {hasAccess ? (
                                  <Eye className="w-3 h-3 text-green-600" />
                                ) : (
                                  <EyeOff className="w-3 h-3 text-gray-400" />
                                )}
                                <span>{func.name.replace(/^(btn\.|field\.|view\.|action\.)/, "")}</span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Permission Management Tab */}
      {activeTab === "management" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Permission Management</h2>
              <p className="text-gray-600">Configure permissions for different roles</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedRole} onValueChange={setSelectedRole} className="w-48">
                <SelectItem value="default">Select role...</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <Badge className={role.color}>{role.name}</Badge>
                  </SelectItem>
                ))}
              </Select>
              <Button onClick={savePermissions} disabled={!selectedRole || loading}>
                <Save className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {selectedRole && permissions && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Level 1: Modules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye />
                    Level 1: Modules
                  </CardTitle>
                  <CardDescription>Control sidebar module visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {modules.map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <module.icon className="w-4 h-4 text-gray-600" />
                          <Label htmlFor={module.id} className="text-sm cursor-pointer">
                            {module.name}
                          </Label>
                        </div>
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

              {/* Level 2: Routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield />
                    Level 2: Routes
                  </CardTitle>
                  <CardDescription>Control access to navigation routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {routes.map((route) => (
                      <div
                        key={route.id}
                        className="flex items-center justify-between p-2 border rounded"
                        style={{ marginLeft: `${route.level * 12}px` }}
                      >
                        <div>
                          <Label htmlFor={route.id} className="text-sm cursor-pointer">
                            {route.name}
                          </Label>
                          <p className="text-xs text-gray-500">Level {route.level + 1}</p>
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

              {/* Level 3: Functionality */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings />
                    Level 3: Functionality
                  </CardTitle>
                  <CardDescription>Control specific functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {["Buttons", "Form Fields", "Views", "Actions", "Role Management"].map((category) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">{category}</h4>
                        <div className="space-y-2">
                          {functionality
                            .filter((func) => func.category === category)
                            .map((func) => (
                              <div key={func.id} className="flex items-center justify-between p-2 border rounded">
                                <Label htmlFor={func.id} className="text-sm cursor-pointer">
                                  {func.name}
                                </Label>
                                <Switch
                                  id={func.id}
                                  checked={permissions.functionality[func.id] || false}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange("functionality", func.id, checked)
                                  }
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Role Management Section - Only for SuperAdmin */}
          {currentUser?.role === "superadmin" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield />
                    Role Management
                  </div>
                  <Button
                    onClick={() => {
                      setEditingRole(null)
                      setNewRoleName("")
                      setShowRoleModal(true)
                    }}
                  >
                    Create New Role
                  </Button>
                </CardTitle>
                <CardDescription>Manage system roles and their properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={role.color}>{role.name}</Badge>
                        {role.id !== "superadmin" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingRole(role)
                                setNewRoleName(role.name)
                                setNewRoleColor(role.color)
                                setShowRoleModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-600 hover:text-red-800 text-sm ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Role ID: {role.id}</p>
                      <p className="text-xs text-gray-500">Users: {users.filter((u) => u.role === role.id).length}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Role Modal */}
          {showRoleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">{editingRole ? "Edit Role" : "Create New Role"}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Role Name</label>
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter role name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Theme</label>
                    <select
                      value={newRoleColor}
                      onChange={(e) => setNewRoleColor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bg-gray-100 text-gray-800 border-gray-200">Gray</option>
                      <option value="bg-blue-100 text-blue-800 border-blue-200">Blue</option>
                      <option value="bg-green-100 text-green-800 border-green-200">Green</option>
                      <option value="bg-yellow-100 text-yellow-800 border-yellow-200">Yellow</option>
                      <option value="bg-red-100 text-red-800 border-red-200">Red</option>
                      <option value="bg-purple-100 text-purple-800 border-purple-200">Purple</option>
                      <option value="bg-pink-100 text-pink-800 border-pink-200">Pink</option>
                      <option value="bg-indigo-100 text-indigo-800 border-indigo-200">Indigo</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRoleModal(false)
                        setEditingRole(null)
                        setNewRoleName("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingRole ? handleEditRole : handleCreateRole}>
                      {editingRole ? "Update Role" : "Create Role"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedRole && (
            <Alert>
              <AlertDescription>
                Please select a role from the dropdown above to configure permissions.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
