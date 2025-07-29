import type { User, Role, RolePermissions, PermissionState } from "../types/permissions"

const STORAGE_KEY = "permission_system_data"

// Mock data
const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "manager", status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "operator", status: "active" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "viewer", status: "active" },
]

const mockRoles: Role[] = [
  { id: "admin", name: "Administrator", color: "bg-red-100 text-red-800" },
  { id: "manager", name: "Manager", color: "bg-blue-100 text-blue-800" },
  { id: "operator", name: "Operator", color: "bg-green-100 text-green-800" },
  { id: "viewer", name: "Viewer", color: "bg-gray-100 text-gray-800" },
]

const mockPermissions: Record<string, RolePermissions> = {
  admin: {
    roleId: "admin",
    modules: {
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
    },
    routes: {
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
    },
    functionality: {
      "btn.create": true,
      "btn.edit": true,
      "btn.delete": true,
      "btn.save": true,
      "btn.export": true,
      "btn.import": true,
      "field.equipment-name": true,
      "field.tag-01": true,
      "field.tag-02": true,
      "view.table": true,
      "view.details": true,
      "action.filter": true,
      "action.search": true,
    },
  },
  manager: {
    roleId: "manager",
    modules: {
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
    },
    routes: {
      "dashboard-settings": true,
      "dashboard-settings.bot-control": true,
      "dashboard-settings.bot-control.configuration": true,
      "dashboard-settings.bot-control.monitoring": false,
      "dashboard-settings.backend-controls": true,
      "dashboard-settings.backend-controls.bacnet-engine": false,
      "dashboard-settings.backend-controls.tags": true,
      "dashboard-settings.backend-controls.tags.equipment": true,
      "dashboard-settings.backend-controls.tags.area": false,
      settings: false,
    },
    functionality: {
      "btn.create": true,
      "btn.edit": true,
      "btn.delete": false,
      "btn.save": true,
      "btn.export": true,
      "btn.import": false,
      "field.equipment-name": true,
      "field.tag-01": true,
      "field.tag-02": false,
      "view.table": true,
      "view.details": true,
      "action.filter": true,
      "action.search": true,
    },
  },
  operator: {
    roleId: "operator",
    modules: {
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
    },
    routes: {
      "dashboard-settings": false,
      settings: false,
    },
    functionality: {
      "btn.create": false,
      "btn.edit": true,
      "btn.delete": false,
      "btn.save": true,
      "btn.export": false,
      "btn.import": false,
      "field.equipment-name": true,
      "field.tag-01": true,
      "field.tag-02": false,
      "view.table": true,
      "view.details": false,
      "action.filter": true,
      "action.search": true,
    },
  },
  viewer: {
    roleId: "viewer",
    modules: {
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
    },
    routes: {
      "dashboard-settings": false,
      settings: false,
    },
    functionality: {
      "btn.create": false,
      "btn.edit": false,
      "btn.delete": false,
      "btn.save": false,
      "btn.export": false,
      "btn.import": false,
      "field.equipment-name": false,
      "field.tag-01": false,
      "field.tag-02": false,
      "view.table": true,
      "view.details": true,
      "action.filter": true,
      "action.search": true,
    },
  },
}

class PermissionService {
  private getStorageData(): PermissionState {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }

    const initialData: PermissionState = {
      users: mockUsers,
      roles: mockRoles,
      permissions: mockPermissions,
    }

    this.saveToStorage(initialData)
    return initialData
  }

  private saveToStorage(data: PermissionState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // User management
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        resolve(data.users)
      }, 100)
    })
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        const newUser: User = {
          ...user,
          id: Date.now().toString(),
        }
        data.users.push(newUser)
        this.saveToStorage(data)
        resolve(newUser)
      }, 100)
    })
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = this.getStorageData()
        const userIndex = data.users.findIndex((u) => u.id === id)
        if (userIndex === -1) {
          reject(new Error("User not found"))
          return
        }
        data.users[userIndex] = { ...data.users[userIndex], ...updates }
        this.saveToStorage(data)
        resolve(data.users[userIndex])
      }, 100)
    })
  }

  async deleteUser(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        data.users = data.users.filter((u) => u.id !== id)
        this.saveToStorage(data)
        resolve()
      }, 100)
    })
  }

  // Role management
  async getRoles(): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        resolve(data.roles)
      }, 100)
    })
  }

  // Permission management
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

  async getAllPermissions(): Promise<Record<string, RolePermissions>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData()
        resolve(data.permissions)
      }, 100)
    })
  }

  // Utility methods for your existing system
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

  // Check if user has module access
  async hasModuleAccess(userId: string, moduleId: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions?.modules[moduleId] || false
  }

  // Check if user has route access
  async hasRouteAccess(userId: string, routeId: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions?.routes[routeId] || false
  }

  // Check if user has functionality access
  async hasFunctionalityAccess(userId: string, functionalityId: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions?.functionality[functionalityId] || false
  }
}

export const permissionService = new PermissionService()
