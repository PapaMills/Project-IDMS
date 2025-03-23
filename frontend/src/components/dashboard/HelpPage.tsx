import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faq = [
    {
      question: "How do I register a new user?",
      answer: "Go to the Register page and fill in the required details.",
    },
    {
      question: "How do I view active threats?",
      answer: "Navigate to the Threats section to see a list of active threats.",
    },
    {
      question: "How do I reset my password?",
      answer: "Click on the 'Forgot Password' link on the login page and follow the instructions.",
    },
    {
      question: "How do I contact support?",
      answer: "You can contact our support team at support@example.com.",
    },
    {
      question: "How do I update my profile?",
      answer: "Go to the Settings page and update your profile information.",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">Help & Support</h2>
          <div className="w-full max-w-2xl space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="border-b">
                <button
                  className="w-full text-left py-2 text-lg font-medium focus:outline-none"
                  onClick={() => toggleQuestion(index)}
                >
                  {item.question}
                </button>
                {openIndex === index && (
                  <p className="text-sm text-gray-600 py-2">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
