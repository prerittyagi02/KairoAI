import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Markdown from "./Markdown";

type Props = {
  role: string;
  content: string;
};

const MessageBox = ({ role, content }: Props) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-[85%] overflow-hidden border ${
          isUser
            ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-900/20"
            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        }`}
      >
      <CardContent className="p-5 text-sm">
        <Markdown text={content} />
      </CardContent>
      {!isUser && (
        <CardFooter className="border-t bg-transparent  px-6 py-3 text-xs text-muted-foreground">
          Disclaimer: The medical insights and suggestions provided by this
          application are for informational purposes only and should not be
          considered a geniune advice. Please consult a Psychiatrist before
          applying.
        </CardFooter>
      )}
      </Card>
    </div>
  );
};

export default MessageBox;
