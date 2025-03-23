import React from "react";
import AnomalyDetectionChart from "../dashboard/AnomalyDetectionChart";
import AttackVectorsChart from "../dashboard/AttackVectorsChart";
import ThreatPatternChart from "../dashboard/ThreatPatternChart";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

const AnalyticsPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1">
              <AnomalyDetectionChart />
            </div>
            <div className="col-span-1">
              <AttackVectorsChart />
            </div>
            <div className="col-span-1">
              <ThreatPatternChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
