
import React from "react";
import { motion } from "framer-motion";

export const EnhancedDashboardContainer = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-[1440px] mx-auto p-6 overflow-hidden relative ${className}`}>
      {children}
    </div>
  );
};

export const DashboardGrid = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ${className}`}>
      {children}
    </div>
  );
};

export const MobileDashboard = ({ children, className = "" }) => {
  return (
    <motion.div 
      className={`hidden md:block w-full overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export const StripeDashboardMockup = ({ className = "" }) => {
  return (
    <div className={`w-full rounded-lg shadow-xl bg-white overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <h3 className="font-semibold text-gray-800">Your Compliance Dashboard</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Today, April 29, 2025</span>
          <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">P</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Regulatory Updates</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">3 new</span>
            </div>
            <div className="space-y-2">
              {[
                { name: "SFDR Disclosure Requirements", date: "Apr 27", status: "high" },
                { name: "AML Directive Amendment", date: "Apr 25", status: "medium" },
                { name: "ESG Reporting Standards", date: "Apr 22", status: "low" }
              ].map((update, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      update.status === "high" ? "bg-red-500" : 
                      update.status === "medium" ? "bg-yellow-500" : "bg-green-500"
                    }`}></div>
                    <span className="text-xs">{update.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{update.date}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Compliance Score</span>
              <span className="text-xs text-gray-500">+2.3%</span>
            </div>
            <div className="h-[100px] flex items-end justify-between gap-1">
              {[65, 68, 62, 70, 75, 73, 78, 80, 76, 82].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-sm" 
                    style={{ height: `${height}%` }} 
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Jan</span>
              <span className="text-xs text-gray-500">Apr</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-sm font-medium block mb-3">Risk Overview</span>
            <div className="space-y-2">
              {[
                { name: "Data Privacy", value: 82, color: "bg-green-500" },
                { name: "Financial Controls", value: 68, color: "bg-yellow-500" },
                { name: "Regulatory Reporting", value: 91, color: "bg-green-500" }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-sm font-medium block mb-3">Task Completion</span>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    In Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    72%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: "72%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div>
              <p className="text-xs text-blue-800 font-medium">Compliance Assistant</p>
              <p className="text-xs text-blue-600">Ask Dara a question</p>
            </div>
            <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded">Ask</button>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="hidden md:block absolute top-[20%] right-[-120px] w-[250px] h-[500px] bg-white rounded-[30px] shadow-xl transform rotate-[10deg]">
        <div className="w-[90%] h-[75%] mx-auto mt-8 bg-gray-100 rounded-lg overflow-hidden">
          <div className="h-5 bg-blue-500 flex items-center px-2">
            <div className="rounded-full h-2 w-2 bg-white mr-1"></div>
            <div className="text-[6px] text-white">Synapse Mobile</div>
          </div>
          <div className="p-2">
            <div className="mb-2">
              <div className="text-[6px] font-semibold">Risk Dashboard</div>
              <div className="h-[40px] bg-gray-50 rounded-sm mt-1"></div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-[30px] bg-gray-50 rounded-sm"></div>
              <div className="h-[30px] bg-gray-50 rounded-sm"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300"></div>
        </div>
      </div>
    </div>
  );
};
