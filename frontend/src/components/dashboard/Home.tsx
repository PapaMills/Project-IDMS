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
          <div className="w-full max-w-4xl">
            <p className="text-gray-600">Welcome to your security dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
