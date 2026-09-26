import React, { useState } from "react";
import { Page } from "@/components/layout/page";
import {
  StoreLocationRequest,
  StoreManagerItem,
} from "@/data/store-manager-analytics";
import { ManagerRequestsTab } from "@/components/store-manager/manager-requests-tab";
import { StoreManagersTab } from "@/components/store-manager/store-managers-tab";
import { RequestDetailView } from "@/components/store-manager/request-detail-view";
import { AddStoreManagerView } from "@/components/store-manager/add-store-manager-view";

export function StoreManagerPage() {
  const [activeSubTab, setActiveSubTab] = useState<"requests" | "managers">("requests");
  const [currentView, setCurrentView] = useState<"list" | "detail" | "add">("list");
  const [selectedRequest, setSelectedRequest] = useState<StoreLocationRequest | null>(null);
  const [editingManager, setEditingManager] = useState<StoreManagerItem | null>(null);

  const handleViewRequest = (request: StoreLocationRequest) => {
    setSelectedRequest(request);
    setCurrentView("detail");
  };

  const handleAddManager = () => {
    setEditingManager(null);
    setCurrentView("add");
  };

  const handleEditManager = (manager: StoreManagerItem) => {
    setEditingManager(manager);
    setCurrentView("add");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedRequest(null);
    setEditingManager(null);
  };

  const handleSaveManager = (_managerData: Partial<StoreManagerItem>) => {
    setActiveSubTab("managers");
    setCurrentView("list");
    setEditingManager(null);
  };

  return (
    <Page>
      {/* Top Sub-Nav Tab Bar - ONLY rendered in main list view, hidden in detail/add views */}
      {currentView === "list" && (
        <div className="border-b border-border bg-background -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 lg:-mx-6 lg:-mt-6 px-4 sm:px-5 lg:px-6 mb-6">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveSubTab("requests");
                setCurrentView("list");
              }}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeSubTab === "requests"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Manager Requests
            </button>

            <button
              onClick={() => {
                setActiveSubTab("managers");
                setCurrentView("list");
              }}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeSubTab === "managers"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Store Managers
            </button>
          </nav>
        </div>
      )}

      {/* View router */}
      {currentView === "detail" && selectedRequest ? (
        <RequestDetailView request={selectedRequest} onBack={handleBackToList} />
      ) : currentView === "add" ? (
        <AddStoreManagerView
          onBack={handleBackToList}
          onSave={handleSaveManager}
          initialData={editingManager}
        />
      ) : activeSubTab === "requests" ? (
        <ManagerRequestsTab onViewRequest={handleViewRequest} />
      ) : (
        <StoreManagersTab
          onAddStoreManager={handleAddManager}
          onEditStoreManager={handleEditManager}
        />
      )}
    </Page>
  );
}
