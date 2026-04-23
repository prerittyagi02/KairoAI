"use client";

import { Loader2, Mic, MicOff, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	onRecordingComplete?: (blob: Blob) => void;
	isProcessing?: boolean;
};

export default function VoiceRecorder({
	onRecordingComplete,
	isProcessing,
}: Props) {
	const [isRecording, setIsRecording] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [recordingAvailable, setRecordingAvailable] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunks = useRef<Blob[]>([]);

	const canRecord =
		typeof window !== "undefined" &&
		!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

	const startRecording = async () => {
		if (!canRecord) return;

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const recorder = new MediaRecorder(stream);
		mediaRecorderRef.current = recorder;
		chunks.current = [];

		recorder.addEventListener("dataavailable", (event) => {
			if (event.data.size > 0) {
				chunks.current.push(event.data);
			}
		});

		recorder.addEventListener("stop", () => {
			const blob = new Blob(chunks.current, { type: "audio/webm" });
			setRecordingAvailable(true);
			const url = URL.createObjectURL(blob);
			setAudioUrl(url);
			onRecordingComplete?.(blob);
		});

		recorder.start();
		setIsRecording(true);
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		setIsRecording(false);
	};

	const togglePlayback = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);
		const handleEnded = () => setIsPlaying(false);

		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	const buttonClass = useMemo(
		() =>
			cn(
				"flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
				isRecording
					? "bg-rose-500 text-white hover:bg-rose-600"
					: "bg-teal-600 text-white hover:bg-teal-700",
			),
		[isRecording],
	);

	return (
		<div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
						Voice Symptom Recorder
					</h3>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						Speak your symptoms to get a quick analysis. Press the microphone to
						start recording.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={isRecording ? stopRecording : startRecording}
						className={buttonClass}
						disabled={false}
					>
						{isRecording ? (
							<MicOff className="h-4 w-4" />
						) : (
							<Mic className="h-4 w-4" />
						)}
						{isRecording ? "Stop" : "Record"}
					</Button>
				</div>
			</div>

			{recordingAvailable && audioUrl ? (
				<div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
					<audio src={audioUrl} ref={audioRef} controls className="w-full">
						<track kind="captions" src="" label="No captions available" />
					</audio>
					<div className="flex items-center gap-3">
						<Button onClick={togglePlayback} size="sm" className="rounded-full">
							{isPlaying ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
							{isPlaying ? "Pause" : "Play"}
						</Button>
						<div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
							<Volume2 className="h-4 w-4" />
							Recorded audio ready to send to the AI.
						</div>
					</div>
				</div>
			) : null}

			{isProcessing ? (
				<div className="flex items-center gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-700 dark:bg-teal-900/40 dark:text-teal-100">
					<Loader2 className="h-5 w-5 animate-spin" />
					Processing your audio...
				</div>
			) : null}
		</div>
	);
}
