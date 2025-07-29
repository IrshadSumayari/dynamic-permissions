"use client"

import { useState } from "react"
import { useUIPermission } from "../hooks/useUIPermission"

// Example components showing how to use UI permissions

// Modal Component with Permission Control
export function PermissionControlledModal({ userId, modalId, children, trigger }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const { canShowModal, loading } = useUIPermission(userId)

  if (loading) return <div>Loading...</div>

  if (!canShowModal(modalId)) {
    return null // Don't render the modal trigger if no permission
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {trigger}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modal Content</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

// Toggle Component with Permission Control
export function PermissionControlledToggle({ userId, toggleId, label, onChange }: any) {
  const [isEnabled, setIsEnabled] = useState(false)
  const { canShowToggle, loading } = useUIPermission(userId)

  if (loading) return <div>Loading...</div>

  if (!canShowToggle(toggleId)) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
        <span className="text-sm text-gray-500">{label} (No Permission)</span>
        <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  const handleToggle = () => {
    setIsEnabled(!isEnabled)
    onChange?.(!isEnabled)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isEnabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

// Conditional UI Component
export function PermissionControlledConditionalUI({ userId, elementId, children, fallback }: any) {
  const { canShowConditionalUI, loading } = useUIPermission(userId)

  if (loading) return <div>Loading...</div>

  if (!canShowConditionalUI(elementId)) {
    return fallback || null
  }

  return children
}

// Component with Permission Control
export function PermissionControlledComponent({ userId, componentId, children }: any) {
  const { canShowComponent, loading } = useUIPermission(userId)

  if (loading) return <div>Loading...</div>

  if (!canShowComponent(componentId)) {
    return null
  }

  return children
}

// Action Button with Permission Control
export function PermissionControlledAction({ userId, actionId, children, onClick, ...props }: any) {
  const { canPerformAction, loading } = useUIPermission(userId)

  if (loading) return <div>Loading...</div>

  return (
    <button
      onClick={canPerformAction(actionId) ? onClick : undefined}
      disabled={!canPerformAction(actionId)}
      className={`px-4 py-2 rounded font-medium transition-colors ${
        canPerformAction(actionId)
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

// Example Usage Component
export function UIPermissionExamples() {
  const [selectedUser, setSelectedUser] = useState("1")

  const users = [
    { id: "1", name: "Admin User" },
    { id: "2", name: "Manager User" },
    { id: "3", name: "Operator User" },
    { id: "4", name: "Viewer User" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Test as:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modal Example */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Modal Permission Example</h3>
          <PermissionControlledModal
            userId={selectedUser}
            modalId="dashboard-settings.bot-control.config-modal"
            trigger="Open Configuration Modal"
          >
            <p>This modal is only visible to users with the appropriate permissions.</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
            </div>
          </PermissionControlledModal>
        </div>

        {/* Toggle Example */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Toggle Permission Example</h3>
          <PermissionControlledToggle
            userId={selectedUser}
            toggleId="energy-management.dashboard.real-time-toggle"
            label="Real-time Updates"
            onChange={(enabled: boolean) => console.log("Toggle changed:", enabled)}
          />
        </div>

        {/* Conditional UI Example */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Conditional UI Example</h3>
          <PermissionControlledConditionalUI
            userId={selectedUser}
            elementId="energy-management.dashboard.advanced-filters"
            fallback={
              <div className="p-3 bg-gray-100 rounded text-sm text-gray-600">Advanced filters not available</div>
            }
          >
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-900">Advanced Filters</h4>
              <div className="mt-2 space-y-2">
                <input placeholder="Filter by name..." className="w-full px-3 py-2 border rounded" />
                <input placeholder="Date range..." className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
          </PermissionControlledConditionalUI>
        </div>

        {/* Action Example */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Action Permission Example</h3>
          <div className="space-y-2">
            <PermissionControlledAction
              userId={selectedUser}
              actionId="dashboard-settings.backend-controls.services-monitoring.restart-action"
              onClick={() => alert("Service restarted!")}
            >
              Restart Service
            </PermissionControlledAction>

            <PermissionControlledAction
              userId={selectedUser}
              actionId="energy-management.dashboard.export-modal"
              onClick={() => alert("Export started!")}
            >
              Export Data
            </PermissionControlledAction>
          </div>
        </div>
      </div>
    </div>
  )
}
