"use client";

import { useState, useEffect, useMemo } from "react";

// Enhanced Types for UI State Management
interface UIPermission {
  id: string;
  name: string;
  type: "route" | "modal" | "toggle" | "conditional" | "component" | "action";
  parentId?: string;
  level: number;
  description?: string;
  dependencies?: string[]; // Other permissions this depends on
}

interface RolePermissions {
  roleId: string;
  modules: Record<string, boolean>;
  routes: Record<string, boolean>;
  uiElements: Record<string, boolean>; // New: UI elements (modals, toggles, etc.)
  functionality: Record<string, boolean>;
}

// Enhanced Permission Service
class EnhancedPermissionService {
  private STORAGE_KEY = "enhanced_permission_system_data";

  private mockUIElements: UIPermission[] = [
    // Dashboard Settings Module
    {
      id: "dashboard-settings",
      name: "Dashboard Settings",
      type: "route",
      level: 0,
    },
    {
      id: "dashboard-settings.bot-control",
      name: "Bot Control Tab",
      type: "route",
      parentId: "dashboard-settings",
      level: 1,
    },
    {
      id: "dashboard-settings.bot-control.config-modal",
      name: "Configuration Modal",
      type: "modal",
      parentId: "dashboard-settings.bot-control",
      level: 2,
      description: "Modal for bot configuration",
    },
    {
      id: "dashboard-settings.bot-control.monitoring-toggle",
      name: "Monitoring Toggle",
      type: "toggle",
      parentId: "dashboard-settings.bot-control",
      level: 2,
      description: "Toggle monitoring on/off",
    },
    {
      id: "dashboard-settings.bot-control.advanced-settings",
      name: "Advanced Settings Panel",
      type: "conditional",
      parentId: "dashboard-settings.bot-control",
      level: 2,
      description: "Conditionally shown advanced panel",
    },

    {
      id: "dashboard-settings.backend-controls",
      name: "Backend Controls Tab",
      type: "route",
      parentId: "dashboard-settings",
      level: 1,
    },
    {
      id: "dashboard-settings.backend-controls.bacnet-engine",
      name: "BACnet Engine",
      type: "route",
      parentId: "dashboard-settings.backend-controls",
      level: 2,
    },
    {
      id: "dashboard-settings.backend-controls.bacnet-engine.device-modal",
      name: "Add Device Modal",
      type: "modal",
      parentId: "dashboard-settings.backend-controls.bacnet-engine",
      level: 3,
      description: "Modal to add new BACnet device",
    },
    {
      id: "dashboard-settings.backend-controls.bacnet-engine.bulk-actions",
      name: "Bulk Device Actions",
      type: "component",
      parentId: "dashboard-settings.backend-controls.bacnet-engine",
      level: 3,
      description: "Bulk operations component",
    },

    {
      id: "dashboard-settings.backend-controls.tags",
      name: "Tags Section",
      type: "route",
      parentId: "dashboard-settings.backend-controls",
      level: 2,
    },
    {
      id: "dashboard-settings.backend-controls.tags.equipment-tab",
      name: "Equipment Tag Tab",
      type: "component",
      parentId: "dashboard-settings.backend-controls.tags",
      level: 3,
    },
    {
      id: "dashboard-settings.backend-controls.tags.area-tab",
      name: "Area Tag Tab",
      type: "component",
      parentId: "dashboard-settings.backend-controls.tags",
      level: 3,
    },
    {
      id: "dashboard-settings.backend-controls.tags.datapoint-tab",
      name: "Datapoint Tagging Tab",
      type: "component",
      parentId: "dashboard-settings.backend-controls.tags",
      level: 3,
    },
    {
      id: "dashboard-settings.backend-controls.tags.create-tag-modal",
      name: "Create Tag Modal",
      type: "modal",
      parentId: "dashboard-settings.backend-controls.tags",
      level: 3,
      description: "Modal for creating new tags",
    },
    {
      id: "dashboard-settings.backend-controls.tags.import-export-toggle",
      name: "Import/Export Toggle",
      type: "toggle",
      parentId: "dashboard-settings.backend-controls.tags",
      level: 3,
      description: "Toggle import/export functionality",
    },

    {
      id: "dashboard-settings.backend-controls.services-monitoring",
      name: "Services Monitoring",
      type: "route",
      parentId: "dashboard-settings.backend-controls",
      level: 2,
    },
    {
      id: "dashboard-settings.backend-controls.services-monitoring.status-modal",
      name: "Service Status Modal",
      type: "modal",
      parentId: "dashboard-settings.backend-controls.services-monitoring",
      level: 3,
      description: "Detailed service status modal",
    },
    {
      id: "dashboard-settings.backend-controls.services-monitoring.restart-action",
      name: "Restart Service Action",
      type: "action",
      parentId: "dashboard-settings.backend-controls.services-monitoring",
      level: 3,
      description: "Action to restart services",
    },

    // Energy Management Module
    {
      id: "energy-management",
      name: "Energy Management",
      type: "route",
      level: 0,
    },
    {
      id: "energy-management.dashboard",
      name: "Energy Dashboard",
      type: "route",
      parentId: "energy-management",
      level: 1,
    },
    {
      id: "energy-management.dashboard.chart-toggle",
      name: "Chart View Toggle",
      type: "toggle",
      parentId: "energy-management.dashboard",
      level: 2,
      description: "Toggle between chart types",
    },
    {
      id: "energy-management.dashboard.export-modal",
      name: "Export Data Modal",
      type: "modal",
      parentId: "energy-management.dashboard",
      level: 2,
      description: "Modal for data export options",
    },
    {
      id: "energy-management.dashboard.real-time-toggle",
      name: "Real-time Updates",
      type: "toggle",
      parentId: "energy-management.dashboard",
      level: 2,
      description: "Enable/disable real-time updates",
    },
    {
      id: "energy-management.dashboard.advanced-filters",
      name: "Advanced Filters Panel",
      type: "conditional",
      parentId: "energy-management.dashboard",
      level: 2,
      description: "Advanced filtering options",
    },

    // Settings Module
    { id: "settings", name: "Settings", type: "route", level: 0 },
    {
      id: "settings.general",
      name: "General Settings",
      type: "route",
      parentId: "settings",
      level: 1,
    },
    {
      id: "settings.general.theme-toggle",
      name: "Theme Toggle",
      type: "toggle",
      parentId: "settings.general",
      level: 2,
      description: "Dark/Light theme toggle",
    },
    {
      id: "settings.general.backup-modal",
      name: "Backup Settings Modal",
      type: "modal",
      parentId: "settings.general",
      level: 2,
      description: "Backup configuration modal",
    },
    {
      id: "settings.security",
      name: "Security Settings",
      type: "route",
      parentId: "settings",
      level: 1,
    },
    {
      id: "settings.security.2fa-toggle",
      name: "2FA Toggle",
      type: "toggle",
      parentId: "settings.security",
      level: 2,
      description: "Two-factor authentication toggle",
    },
    {
      id: "settings.security.password-modal",
      name: "Change Password Modal",
      type: "modal",
      parentId: "settings.security",
      level: 2,
      description: "Password change modal",
    },
  ];

  private mockPermissions: Record<string, RolePermissions> = {
    admin: {
      roleId: "admin",
      modules: {
        "energy-management": true,
        "dashboard-settings": true,
        settings: true,
      },
      routes: {
        "dashboard-settings": true,
        "dashboard-settings.bot-control": true,
        "dashboard-settings.backend-controls": true,
        "energy-management": true,
        "energy-management.dashboard": true,
        settings: true,
        "settings.general": true,
        "settings.security": true,
      },
      uiElements: {
        "dashboard-settings.bot-control.config-modal": true,
        "dashboard-settings.bot-control.monitoring-toggle": true,
        "dashboard-settings.bot-control.advanced-settings": true,
        "dashboard-settings.backend-controls.bacnet-engine.device-modal": true,
        "dashboard-settings.backend-controls.bacnet-engine.bulk-actions": true,
        "dashboard-settings.backend-controls.tags.create-tag-modal": true,
        "dashboard-settings.backend-controls.tags.import-export-toggle": true,
        "dashboard-settings.backend-controls.services-monitoring.status-modal":
          true,
        "dashboard-settings.backend-controls.services-monitoring.restart-action":
          true,
        "energy-management.dashboard.chart-toggle": true,
        "energy-management.dashboard.export-modal": true,
        "energy-management.dashboard.real-time-toggle": true,
        "energy-management.dashboard.advanced-filters": true,
        "settings.general.theme-toggle": true,
        "settings.general.backup-modal": true,
        "settings.security.2fa-toggle": true,
        "settings.security.password-modal": true,
      },
      functionality: {
        "btn.create": true,
        "btn.edit": true,
        "btn.delete": true,
        "btn.save": true,
        "btn.export": true,
        "btn.import": true,
      },
    },
    manager: {
      roleId: "manager",
      modules: {
        "energy-management": true,
        "dashboard-settings": true,
        settings: false,
      },
      routes: {
        "dashboard-settings": true,
        "dashboard-settings.bot-control": true,
        "dashboard-settings.backend-controls": true,
        "energy-management": true,
        "energy-management.dashboard": true,
        settings: false,
      },
      uiElements: {
        "dashboard-settings.bot-control.config-modal": true,
        "dashboard-settings.bot-control.monitoring-toggle": true,
        "dashboard-settings.bot-control.advanced-settings": false,
        "dashboard-settings.backend-controls.bacnet-engine.device-modal": false,
        "dashboard-settings.backend-controls.bacnet-engine.bulk-actions": false,
        "dashboard-settings.backend-controls.tags.create-tag-modal": true,
        "dashboard-settings.backend-controls.tags.import-export-toggle": false,
        "dashboard-settings.backend-controls.services-monitoring.status-modal":
          true,
        "dashboard-settings.backend-controls.services-monitoring.restart-action":
          false,
        "energy-management.dashboard.chart-toggle": true,
        "energy-management.dashboard.export-modal": true,
        "energy-management.dashboard.real-time-toggle": true,
        "energy-management.dashboard.advanced-filters": false,
        "settings.general.theme-toggle": false,
        "settings.general.backup-modal": false,
        "settings.security.2fa-toggle": false,
        "settings.security.password-modal": false,
      },
      functionality: {
        "btn.create": true,
        "btn.edit": true,
        "btn.delete": false,
        "btn.save": true,
        "btn.export": true,
        "btn.import": false,
      },
    },
    operator: {
      roleId: "operator",
      modules: {
        "energy-management": true,
        "dashboard-settings": false,
        settings: false,
      },
      routes: {
        "dashboard-settings": false,
        "energy-management": true,
        "energy-management.dashboard": true,
        settings: false,
      },
      uiElements: {
        "energy-management.dashboard.chart-toggle": true,
        "energy-management.dashboard.export-modal": false,
        "energy-management.dashboard.real-time-toggle": true,
        "energy-management.dashboard.advanced-filters": false,
      },
      functionality: {
        "btn.create": false,
        "btn.edit": true,
        "btn.delete": false,
        "btn.save": true,
        "btn.export": false,
        "btn.import": false,
      },
    },
    viewer: {
      roleId: "viewer",
      modules: {
        "energy-management": true,
        "dashboard-settings": false,
        settings: false,
      },
      routes: {
        "energy-management": true,
        "energy-management.dashboard": true,
      },
      uiElements: {
        "energy-management.dashboard.chart-toggle": true,
        "energy-management.dashboard.export-modal": false,
        "energy-management.dashboard.real-time-toggle": false,
        "energy-management.dashboard.advanced-filters": false,
      },
      functionality: {
        "btn.create": false,
        "btn.edit": false,
        "btn.delete": false,
        "btn.save": false,
        "btn.export": false,
        "btn.import": false,
      },
    },
  };

  getStorageData() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    const initialData = {
      uiElements: this.mockUIElements,
      permissions: this.mockPermissions,
    };

    this.saveToStorage(initialData);
    return initialData;
  }

  saveToStorage(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async getUIElements(): Promise<UIPermission[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData();
        resolve(data.uiElements);
      }, 100);
    });
  }

  async getRolePermissions(roleId: string): Promise<RolePermissions | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData();
        resolve(data.permissions[roleId] || null);
      }, 100);
    });
  }

  async updateRolePermissions(
    roleId: string,
    permissions: Partial<RolePermissions>
  ): Promise<RolePermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getStorageData();
        data.permissions[roleId] = {
          ...data.permissions[roleId],
          ...permissions,
          roleId,
        };
        this.saveToStorage(data);
        resolve(data.permissions[roleId]);
      }, 100);
    });
  }

  // Check if user has access to specific UI element
  async hasUIElementAccess(
    userId: string,
    elementId: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions?.uiElements[elementId] || false;
  }

  async getUserPermissions(userId: string): Promise<RolePermissions | null> {
    // Mock user lookup - in real app this would come from your auth system
    const userRoleMap: Record<string, string> = {
      "1": "admin",
      "2": "manager",
      "3": "operator",
      "4": "viewer",
    };

    const userRole = userRoleMap[userId];
    if (!userRole) return null;

    return this.getRolePermissions(userRole);
  }
}

const enhancedPermissionService = new EnhancedPermissionService();

// Custom UI Components
const Button = ({
  children,
  onClick,
  disabled,
  className = "",
  variant = "default",
}: any) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);
const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
);
const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Badge = ({ children, className = "" }: any) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

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
);

const Select = ({ value, onValueChange, children, className = "" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(children, "chilere");
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {value || "Select option..."}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {children.map((child: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                onValueChange(child.props.value);
                setIsOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ value, children }: any) => <div>{children}</div>;

const Label = ({ children, htmlFor, className = "" }: any) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium text-gray-700 ${className}`}
  >
    {children}
  </label>
);

// Icons
const Eye = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOff = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

const Modal = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Toggle = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
    />
  </svg>
);

const Component = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const Conditional = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Action = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const Route = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

const Save = ({ className = "" }: any) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
);

// Get icon component based on UI element type
const getTypeIcon = (type: string) => {
  const icons = {
    route: Route,
    modal: Modal,
    toggle: Toggle,
    conditional: Conditional,
    component: Component,
    action: Action,
  };
  return icons[type as keyof typeof icons] || Component;
};

// Main Enhanced Permission System Component
export function EnhancedPermissionSystem() {
  const [activeTab, setActiveTab] = useState("demo");
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [selectedUser, setSelectedUser] = useState<string>("1");
  const [uiElements, setUIElements] = useState<UIPermission[]>([]);
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [userPermissions, setUserPermissions] =
    useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState(false);

  const users = [
    { id: "1", name: "John Doe (Admin)", role: "admin" },
    { id: "2", name: "Jane Smith (Manager)", role: "manager" },
    { id: "3", name: "Bob Johnson (Operator)", role: "operator" },
    { id: "4", name: "Alice Brown (Viewer)", role: "viewer" },
  ];

  const roles = [
    {
      id: "admin",
      name: "Administrator",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      id: "manager",
      name: "Manager",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "operator",
      name: "Operator",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      id: "viewer",
      name: "Viewer",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser);
    }
  }, [selectedUser]);

  const loadInitialData = async () => {
    try {
      const elementsData = await enhancedPermissionService.getUIElements();
      setUIElements(elementsData);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    }
  };

  const loadRolePermissions = async (roleId: string) => {
    try {
      setLoading(true);
      const rolePermissions =
        await enhancedPermissionService.getRolePermissions(roleId);
      setPermissions(rolePermissions);
    } catch (error) {
      console.error("Failed to load role permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPermissions = async (userId: string) => {
    try {
      const userPerms = await enhancedPermissionService.getUserPermissions(
        userId
      );
      setUserPermissions(userPerms);
    } catch (error) {
      console.error("Failed to load user permissions:", error);
    }
  };

  const handleUIElementPermissionChange = (
    elementId: string,
    value: boolean
  ) => {
    if (!permissions) return;

    setPermissions((prev) => ({
      ...prev!,
      uiElements: {
        ...prev!.uiElements,
        [elementId]: value,
      },
    }));
  };

  const savePermissions = async () => {
    if (!permissions || !selectedRole) return;

    try {
      setLoading(true);
      await enhancedPermissionService.updateRolePermissions(
        selectedRole,
        permissions
      );
      alert("Permissions updated successfully!");
    } catch (error) {
      console.error("Failed to save permissions:", error);
      alert("Failed to save permissions");
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users.find((u) => u.id === selectedUser);
  const currentRole = roles.find((r) => r.id === currentUser?.role);

  // Group UI elements by type for better organization
  const elementsByType = useMemo(() => {
    const grouped: Record<string, UIPermission[]> = {};
    uiElements.forEach((element) => {
      if (!grouped[element.type]) {
        grouped[element.type] = [];
      }
      grouped[element.type].push(element);
    });
    return grouped;
  }, [uiElements]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Enhanced UI Permission System
          </h1>
          <p className="text-gray-600">
            Manage permissions for routes, modals, toggles, and conditional UI
            elements
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "demo", name: "Live Demo", icon: Eye },
            { id: "management", name: "UI Permission Management", icon: Modal },
          ].map((tab) => {
            const IconComponent = tab.icon;
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
            );
          })}
        </nav>
      </div>

      {/* Live Demo Tab */}
      {activeTab === "demo" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
            <label className="text-sm font-medium">Test as user:</label>
            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
              className="w-64"
            >
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span>{user.name}</span>
                    {currentRole && (
                      <Badge className={currentRole.color}>
                        {currentRole.name}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UI Elements by Type */}
            {Object.entries(elementsByType).map(([type, elements]) => {
              const TypeIcon = getTypeIcon(type);
              const accessibleElements = elements.filter(
                (element) => userPermissions?.uiElements[element.id]
              );

              return (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TypeIcon className="text-gray-600" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}s
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        {accessibleElements.length}/{elements.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {type === "modal" && "Popup modals and dialogs"}
                      {type === "toggle" &&
                        "Toggle switches and state controls"}
                      {type === "conditional" &&
                        "Conditionally shown UI elements"}
                      {type === "component" && "UI components and sections"}
                      {type === "action" && "User actions and operations"}
                      {type === "route" && "Navigation routes and pages"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {elements.map((element) => {
                        const hasAccess =
                          userPermissions?.uiElements[element.id] || false;
                        return (
                          <div
                            key={element.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              hasAccess
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                            style={{ marginLeft: `${element.level * 12}px` }}
                          >
                            {hasAccess ? (
                              <Eye className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  hasAccess ? "text-green-800" : "text-red-800"
                                }`}
                              >
                                {element.name}
                              </p>
                              {element.description && (
                                <p
                                  className={`text-xs ${
                                    hasAccess
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {element.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                Level {element.level + 1} • {element.id}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mock UI Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Mock UI Examples</CardTitle>
              <CardDescription>
                Examples of how permissions control different UI elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Modal Example */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Modal Example</h4>
                  <Button
                    disabled={
                      !userPermissions?.uiElements[
                        "dashboard-settings.backend-controls.tags.create-tag-modal"
                      ]
                    }
                    className="w-full"
                  >
                    {userPermissions?.uiElements[
                      "dashboard-settings.backend-controls.tags.create-tag-modal"
                    ]
                      ? "Create Tag Modal"
                      : "Create Tag Modal (Disabled)"}
                  </Button>
                </div>

                {/* Toggle Example */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Toggle Example</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Updates</span>
                    <Switch
                      checked={false}
                      disabled={
                        !userPermissions?.uiElements[
                          "energy-management.dashboard.real-time-toggle"
                        ]
                      }
                      onCheckedChange={() => {}}
                    />
                  </div>
                </div>

                {/* Conditional UI Example */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Conditional UI</h4>
                  {userPermissions?.uiElements[
                    "energy-management.dashboard.advanced-filters"
                  ] ? (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                      Advanced Filters Panel Visible
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                      Advanced Filters Hidden
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permission Management Tab */}
      {activeTab === "management" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                UI Element Permission Management
              </h2>
              <p className="text-gray-600">
                Configure permissions for modals, toggles, and conditional UI
                elements
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="w-48"
              >
                <SelectItem value="none">Select role...</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <Badge className={role.color}>{role.name}</Badge>
                  </SelectItem>
                ))}
              </Select>
              <Button
                onClick={savePermissions}
                disabled={!selectedRole || loading}
              >
                <Save className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {selectedRole && permissions && (
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(elementsByType).map(([type, elements]) => {
                const TypeIcon = getTypeIcon(type);

                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TypeIcon />
                        {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                        Permissions
                      </CardTitle>
                      <CardDescription>
                        Control access to {type}s for the{" "}
                        {roles.find((r) => r.id === selectedRole)?.name} role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {elements.map((element) => (
                          <div
                            key={element.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                            style={{ marginLeft: `${element.level * 16}px` }}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={element.id}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {element.name}
                                </Label>
                                <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                                  Level {element.level + 1}
                                </Badge>
                              </div>
                              {element.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {element.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {element.id}
                              </p>
                            </div>
                            <Switch
                              id={element.id}
                              checked={
                                permissions.uiElements[element.id] || false
                              }
                              onCheckedChange={(checked) =>
                                handleUIElementPermissionChange(
                                  element.id,
                                  checked
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!selectedRole && (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Please select a role from the dropdown above to configure UI
                element permissions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
