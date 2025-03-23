import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

const SystemsPage = () => {
  const demoSystems = [
    {
      id: "1",
      name: "Firewall",
      status: "Operational",
      lastChecked: "2025-03-01 12:00:00",
    },
    {
      id: "2",
      name: "Intrusion Detection System",
      status: "Operational",
      lastChecked: "2025-03-01 12:00:00",
    },
    {
      id: "3",
      name: "Antivirus",
      status: "Degraded",
      lastChecked: "2025-03-01 12:00:00",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">Systems</h2>
          <div className="w-full max-w-4xl">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-left">System Name</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {demoSystems.map((system) => (
                  <tr key={system.id}>
                    <td className="py-2">{system.name}</td>
                    <td className="py-2">{system.status}</td>
                    <td className="py-2">{system.lastChecked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsPage;
