/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportComponent from "@/components/ReportComponent";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ChatComponent from "@/components/ChatComponent";

export default function MentalHealthAnalyzer() {
  const [isDark, setIsDark] = useState(false);
  const [reportAdded, setReportAdded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const [reportData, setreportData] = useState("");

  const onReportConfirmation = (data: string) => {
    setreportData(data);
    console.log(reportData);
    toast({
      title: "Updated",
      description: "Your medical report has been successfully uploaded",
    });
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-gray-900 to-gray-800 text-gray-100"
          : "from-blue-50 to-indigo-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src="/medical.png" alt="Medihelp Logo" className="h-8 w-8" />
            </div>
            <h1
              className={`text-3xl font-extrabold tracking-tight ${
                isDark
                  ? "text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text"
                  : "text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text"
              }`}
            >
              MediHelp
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${
              isDark
                ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                : "border-blue-200 bg-white hover:bg-blue-50"
            }`}
            onClick={toggleDark}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className={`border-0 overflow-hidden shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-blue-100"
            }`}
          >
            <CardHeader
              className={`${isDark ? "bg-gray-750" : "bg-indigo-50"} pb-3`}
            >
              <CardTitle
                className={`flex items-center gap-2 ${
                  isDark ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                  <line x1="9" y1="11" x2="15" y2="11"></line>
                </svg>
                Upload your medical report in PDF or JPG format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <ReportComponent onReportConfirmation={onReportConfirmation} />
            </CardContent>
          </Card>

          <Card
            className={`border-0 overflow-hidden shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-blue-100"
            }`}
          >
            <CardHeader
              className={`${isDark ? "bg-gray-750" : "bg-indigo-50"} pb-3`}
            >
              <CardTitle
                className={`flex items-center gap-2 ${
                  isDark ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chat with MediHelp AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChatComponent reportData={reportData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
