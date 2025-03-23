import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

const Home = () => {
  const [threats, setThreats] = useState([
    { id: 1, name: "Threat 1", status: "New" },
    { id: 2, name: "Threat 2", status: "New" },
    { id: 3, name: "Threat 3", status: "New" },
  ]);

  const handleMarkAsInvestigating = (id: number) => {
    setThreats((prevThreats) =>
      prevThreats.map((threat) =>
        threat.id === id ? { ...threat, status: "Investigating" } : threat
      )
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
          <div className="w-full max-w-4xl space-y-4">
            <h3 className="text-xl font-medium">Detected Threats</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-left">Threat Name</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((threat) => (
                  <tr key={threat.id}>
                    <td className="py-2">{threat.name}</td>
                    <td className="py-2">{threat.status}</td>
                    <td className="py-2">
                      <button
                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => alert(`Viewing details for ${threat.name}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-lg"
                        onClick={() => handleMarkAsInvestigating(threat.id)}
                      >
                        Mark as Investigating
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        onClick={() => alert(`Ignoring ${threat.name}`)}
                      >
                        Ignore
                      </button>
                    </td>
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

export default Home;
