"use client";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CornerDownLeft, Loader2, BrainCircuit } from "lucide-react";
import Messages from "./Messages";
import { Badge } from "./ui/badge";

type Props = {
  reportData: string;
};

const ChatComponent = ({ reportData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/resumechat", streamProtocol: "data" });

  return (
    <div className="relative flex h-[72vh] min-h-[480px] max-h-[780px] flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-b from-indigo-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
      <Badge
        variant="outline"
        className={`absolute right-4 top-4 py-1 px-3 font-medium ${
          reportData
            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
        }`}
      >
        {reportData ? "✓ Report Added" : "No Report or Speech Added"}
      </Badge>

      <div className="flex-1 overflow-y-auto rounded-t-xl bg-white/80 dark:bg-gray-800/70 p-6 mt-4 shadow-inner">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500 dark:text-gray-400">
            <BrainCircuit className="h-12 w-12 text-indigo-400 dark:text-indigo-300" />
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-indigo-600 dark:text-indigo-400">
                MediHelp AI Assistant
              </h3>
              <p className="max-w-sm">
                Upload your medical report and ask questions about your mental
                health or medical concerns.
              </p>
            </div>
          </div>
        ) : (
          <Messages messages={messages} isLoading={isLoading} />
        )}
      </div>

      <form
        className="relative overflow-hidden rounded-b-xl border border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md mx-3 mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              const form = event.currentTarget.form;
              form?.requestSubmit();
            }
          }}
          placeholder="Type your mental health question here..."
          className="min-h-12 resize-none border-0 p-4 shadow-none focus-visible:ring-1 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            className={`ml-auto ${
              isLoading
                ? "bg-indigo-300 dark:bg-indigo-800"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            } text-white rounded-full px-4 py-2 transition-all duration-200 ease-in-out`}
          >
            {isLoading ? "Analyzing..." : "Ask about Mental Health"}
            {isLoading ? (
              <Loader2 className="ml-2 size-4 animate-spin" />
            ) : (
              <CornerDownLeft className="ml-2 size-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
