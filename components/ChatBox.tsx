"use client";

import { motion } from "framer-motion";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import LanguageSelector, { LanguageCode } from "@/components/LanguageSelector";
import Markdown from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

type Props = {
	initialMessages?: ChatMessage[];
	initialLanguage?: LanguageCode;
	placeholder?: string;
	onSend?: (message: string, language: LanguageCode) => Promise<string>;
};

export default function ChatBox({
	initialMessages = [],
	initialLanguage = "en",
	placeholder = "Ask the AI doctor anything about your health...",
	onSend,
}: Props) {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [input, setInput] = useState("");
	const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
	const [isLoading, setIsLoading] = useState(false);
	const scrollRef = useRef<HTMLDivElement | null>(null);

	const canSend = input.trim().length > 0 && !isLoading;

	useEffect(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, []);

	const sendMessage = async () => {
		if (!canSend) return;

		const question = input.trim();
		setMessages((prev) => [...prev, { role: "user", content: question }]);
		setInput("");
		setIsLoading(true);

		try {
			const response = onSend ? await onSend(question, language) : "";
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: response },
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"Sorry, something went wrong while contacting the AI assistant. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		await sendMessage();
	};

	const messageRows = useMemo(() => {
		return messages.map((message, index) => {
			const isUser = message.role === "user";
			const bg = isUser
				? "bg-teal-50 text-slate-900"
				: "bg-white/90 text-slate-900 dark:bg-slate-800/70 dark:text-slate-100";
			const align = isUser ? "justify-end" : "justify-start";

			return (
				<div key={index} className={`flex ${align}`}>
					<div
						className={cn(
							"max-w-[85%] rounded-2xl p-4 shadow-sm",
							bg,
							isUser ? "rounded-br-none" : "rounded-bl-none",
						)}
					>
						<div className="text-sm leading-relaxed">
							<Markdown text={message.content} />
						</div>
					</div>
				</div>
			);
		});
	}, [messages]);

	return (
		<div className="flex h-[76vh] min-h-[600px] max-h-[820px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
			<div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
				<div className="flex items-center gap-3">
					<div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-white">
						<MessageSquare className="h-5 w-5" />
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
							AI Doctor Assistant
						</p>
						<p className="text-xs text-slate-500 dark:text-slate-400">
							Ask a question and get a clear response.
						</p>
					</div>
				</div>
				<div className="w-[200px]">
					<LanguageSelector value={language} onChange={setLanguage} />
				</div>
			</div>

			<div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
				{messageRows}
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-center gap-3 border-0"
					>
						<div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
						<div className="space-y-2">
							<div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
							<div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
						</div>
					</motion.div>
				)}
			</div>

			<form
				onSubmit={handleSubmit}
				className="border-t border-slate-200 p-4 dark:border-slate-800"
			>
				<div className="flex gap-3">
					<Textarea
						value={input}
						onChange={(event) => setInput(event.target.value)}
						onKeyDown={async (event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								await sendMessage();
							}
						}}
						placeholder={placeholder}
						className="min-h-[48px] flex-1 resize-none border bg-white px-4 py-3 text-sm text-slate-900 border-teal-500 shadow-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
					/>
					<Button
						type="submit"
						disabled={!canSend}
						className="h-12 w-12 rounded-full p-0"
					>
						{isLoading ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Send className="h-5 w-5" />
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
