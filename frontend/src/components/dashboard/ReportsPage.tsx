import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

const ReportsPage = () => {
  const demoReports = [
    {
      id: "1",
      title: "Monthly Security Report",
      date: "2025-03-01",
      summary: "Summary of security events and incidents for the month.",
    },
    {
      id: "2",
      title: "Weekly Threat Analysis",
      date: "2025-03-07",
      summary: "Detailed analysis of threats detected in the past week.",
    },
    {
      id: "3",
      title: "Daily Activity Log",
      date: "2025-03-10",
      summary: "Log of all activities and events for the day.",
    },
  ];

  const handleDownload = (reportId: string) => {
    // Demo download function
    alert(`Downloading report with ID: ${reportId}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">Reports</h2>
          <div className="w-full max-w-4xl space-y-4">
            {demoReports.map((report) => (
              <div key={report.id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.date}</p>
                <p className="mt-2 text-gray-800">{report.summary}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => handleDownload(report.id)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
