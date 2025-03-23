import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

const SettingsPage = () => {
  const demoSettings = [
    {
      id: "1",
      name: "Notification Settings",
      description: "Manage your notification preferences.",
    },
    {
      id: "2",
      name: "Account Settings",
      description: "Update your account information and password.",
    },
    {
      id: "3",
      name: "Privacy Settings",
      description: "Control your privacy settings and data sharing preferences.",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">Settings</h2>
          <div className="w-full max-w-4xl space-y-4">
            {demoSettings.map((setting) => (
              <div key={setting.id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium">{setting.name}</h3>
                <p className="mt-2 text-gray-800">{setting.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
