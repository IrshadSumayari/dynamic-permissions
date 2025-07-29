"use client";

import { useState } from "react";
import { StandalonePermissionSystem } from "../components/standalone-permission-system";
import { EnhancedPermissionSystem } from "@/components/enhanced-permission-system";
import { UIPermissionExamples } from "@/components/permission-controlled-ui";

export default function Page() {
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            Enhanced UI Permission System
          </h1>
          <p className="text-gray-600">
            Complete permission management for routes, modals, toggles,
            conditional UI, and actions
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("system")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "system"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Permission Management System
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "examples"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              UI Component Examples
            </button>
          </nav>
        </div>

        {activeTab === "system" && <EnhancedPermissionSystem />}
        {activeTab === "examples" && <UIPermissionExamples />}
        <StandalonePermissionSystem />
      </div>
    </div>
  );
}
