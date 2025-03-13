import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { ProfileTab } from "../components/Common/Account/ProfileTab.js";
import { TransactionTab } from "../components/Common/Account/TranscactionTab.js";
import { NotificationTab } from "../components/Common/Account/NotificationTab";
import { PolicyTab } from "../components/Common/Account/PolicyTab.js";
import { useLocation } from "react-router-dom";
import { AccountHeader } from "../components/Common/Account/AccountHeader.js";
import { NavigationTabs } from "../components/Common/Account/NavigationTabs.js";
const Account = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("#profile");
  useEffect(() => {
    setActiveTab(location.hash || "#profile");
  }, [location.hash]);
  const isActive = (path) => activeTab === path;
  const renderTabContent = () => {
    const tabs = {
      "#profile": <ProfileTab user={user} />,
      "#transaction": <TransactionTab user={user} />,
      // "#notification": <NotificationTab />,
      "#policy": <PolicyTab />,
    };
    return tabs[activeTab] || tabs["#profile"];
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <AccountHeader user={user} />
          <NavigationTabs isActive={isActive} />
          <div className="bg-white rounded-lg shadow p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
