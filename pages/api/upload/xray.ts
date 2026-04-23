import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { tmpdir } from "os";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const languageMap: Record<string, string> = {
	en: "English",
	hi: "Hindi",
	ta: "Tamil",
	te: "Telugu",
	bn: "Bengali",
	mr: "Marathi",
	gu: "Gujarati",
	pa: "Punjabi",
	ml: "Malayalam",
	kn: "Kannada",
};

function clampPercent(value: number): number {
	if (Number.isNaN(value)) return 0;
	return Math.min(100, Math.max(0, Math.round(value)));
}

function extractAccuracyAndCleanAnalysis(text: string) {
	const primaryMatch = text.match(/^\s*ACCURACY:\s*(\d{1,3})\s*%/im);
	const fallbackMatch = text.match(/confidence[^0-9]{0,24}(\d{1,3})\s*%/i);
	const rawValue = primaryMatch?.[1] ?? fallbackMatch?.[1] ?? null;
	const accuracy = rawValue
		? clampPercent(Number.parseInt(rawValue, 10))
		: null;

	const cleaned = text
		.replace(/^\s*ACCURACY:\s*\d{1,3}\s*%\s*\n?/im, "")
		.trim();

	return { accuracy, cleaned };
}

function parseDataUrl(dataUrl: string) {
	const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
	if (!match) {
		return null;
	}
	return {
		mimeType: match[1],
		base64: match[2],
	};
}

type EcgPrediction = {
	label: "HB" | "MI" | "PMI" | "Normal";
	confidence: number;
	probabilities: Record<string, number>;
};

const ECG_CLASSES: EcgPrediction["label"][] = ["HB", "MI", "PMI", "Normal"];

function guessFileExtension(mimeType: string) {
	if (mimeType.includes("png")) return "png";
	if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
	if (mimeType.includes("webp")) return "webp";
	return "png";
}

async function runEcgModelLocal(
	base64: string,
	mimeType: string,
): Promise<EcgPrediction> {
	const imageExt = guessFileExtension(mimeType);
	const tempImagePath = path.join(
		tmpdir(),
		`ecg-input-${randomUUID()}.${imageExt}`,
	);
	const modelPath =
		process.env.ECG_MODEL_PATH ||
		path.join(process.cwd(), "Final_ecg_project", "model", "resnet_ecg.h5");
	const scriptPath = path.join(process.cwd(), "scripts", "ecg_infer.py");
	const configuredPythonPath = process.env.ECG_PYTHON_PATH;
	const venvPythonPath = path.join(process.cwd(), ".venv", "bin", "python");
	let pythonPath = configuredPythonPath || "python3";

	if (!configuredPythonPath) {
		try {
			await fs.access(venvPythonPath);
			pythonPath = venvPythonPath;
		} catch {
			pythonPath = "python3";
		}
	}

	try {
		await fs.writeFile(tempImagePath, Buffer.from(base64, "base64"));
		const { stdout } = await execFileAsync(pythonPath, [
			scriptPath,
			"--image",
			tempImagePath,
			"--model",
			modelPath,
		]);
		const parsed = JSON.parse(stdout.trim()) as EcgPrediction;
		return parsed;
	} finally {
		await fs.unlink(tempImagePath).catch(() => undefined);
	}
}

function ensureValidEcgPrediction(payload: unknown): EcgPrediction {
	const parsed = payload as Partial<EcgPrediction> | null;
	if (!parsed || typeof parsed !== "object") {
		throw new Error("Invalid ECG service response.");
	}

	if (!parsed.label || !ECG_CLASSES.includes(parsed.label)) {
		throw new Error("ECG service returned an unknown label.");
	}

	if (typeof parsed.confidence !== "number" || Number.isNaN(parsed.confidence)) {
		throw new Error("ECG service returned invalid confidence.");
	}

	return {
		label: parsed.label,
		confidence: parsed.confidence,
		probabilities:
			parsed.probabilities && typeof parsed.probabilities === "object"
				? parsed.probabilities
				: {},
	};
}

async function runEcgModelRemote(
	serviceUrl: string,
	base64: string,
	mimeType: string,
): Promise<EcgPrediction> {
	const endpointBase = serviceUrl.replace(/\/+$/, "");
	const maxAttempts = 3;
	const timeoutMs = Number(process.env.ECG_REMOTE_TIMEOUT_MS ?? "25000");
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), timeoutMs);
		try {
			const response = await fetch(`${endpointBase}/predict-base64`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					imageBase64: `data:${mimeType};base64,${base64}`,
				}),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errorBody = (await response.json().catch(() => null)) as
					| { detail?: string; message?: string; error?: string }
					| null;
				throw new Error(
					errorBody?.detail ||
						errorBody?.message ||
						errorBody?.error ||
						`ECG service failed (${response.status})`,
				);
			}

			const payload = (await response.json()) as unknown;
			return ensureValidEcgPrediction(payload);
		} catch (error) {
			lastError = error;
			if (attempt < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
			}
		} finally {
			clearTimeout(timeout);
		}
	}

	const message =
		lastError instanceof Error ? lastError.message : "Remote ECG inference failed.";
	throw new Error(`Remote ECG inference failed after ${maxAttempts} attempts: ${message}`);
}

async function generateAnalysisWithRetry(
	systemPrompt: string,
	userPrompt: string,
	imageBase64: string,
	mimeType: string,
) {
	const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
	const maxAttempts = 3;
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		for (const modelName of modelsToTry) {
			try {
				const { text } = await generateText({
					model: google(modelName),
					system: systemPrompt,
					messages: [
						{
							role: "user",
							content: [
								{ type: "text", text: userPrompt },
								{
									type: "image",
									image: imageBase64,
									mimeType,
								},
							],
						},
					],
					temperature: 0.2,
					maxTokens: 1800,
				});
				return text;
			} catch (error) {
				lastError = error;
			}
		}

		if (attempt < maxAttempts) {
			await new Promise((resolve) => setTimeout(resolve, 900 * attempt));
		}
	}

	const lastMessage =
		lastError instanceof Error
			? lastError.message
			: "Model temporarily unavailable.";
	throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${lastMessage}`);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}

	if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		res.status(500).json({
			message: "Missing GOOGLE_GENERATIVE_AI_API_KEY in server environment.",
		});
		return;
	}

	const { imageBase64, language } = req.body as {
		imageBase64?: string;
		language?: string;
		scanType?: "xray" | "ecg" | "auto";
	};

	if (!imageBase64 || typeof imageBase64 !== "string") {
		res.status(400).json({ message: "imageBase64 is required." });
		return;
	}

	const parsed = parseDataUrl(imageBase64);
	if (!parsed) {
		res.status(400).json({
			message: "Invalid image format. Please provide a base64 data URL.",
		});
		return;
	}

	const languageName = languageMap[language || "en"] || "English";

	const scanType =
		(req.body?.scanType as "xray" | "ecg" | "auto" | undefined) || "xray";

	let ecgPrediction: EcgPrediction | null = null;
	let ecgModelError: string | null = null;
	const ecgServiceUrl = process.env.ECG_SERVICE_URL?.trim() || "";
	const allowLocalFallback = process.env.ECG_ALLOW_LOCAL_FALLBACK === "true";

	if (scanType === "ecg" || scanType === "auto") {
		try {
			if (ecgServiceUrl) {
				ecgPrediction = await runEcgModelRemote(
					ecgServiceUrl,
					parsed.base64,
					parsed.mimeType,
				);
			} else {
				ecgPrediction = await runEcgModelLocal(parsed.base64, parsed.mimeType);
			}
		} catch (error) {
			if (ecgServiceUrl && allowLocalFallback) {
				try {
					ecgPrediction = await runEcgModelLocal(parsed.base64, parsed.mimeType);
				} catch (fallbackError) {
					ecgModelError =
						fallbackError instanceof Error
							? fallbackError.message
							: "ECG model inference failed.";
				}
			} else {
				ecgModelError =
					error instanceof Error ? error.message : "ECG model inference failed.";
			}
		}
	}

	const systemPrompt = `You are Kairo AI Medical Imaging Assistant.
You provide educational interpretation support for X-ray and ECG images.
You are not a substitute for a licensed radiologist/cardiologist.

Rules:
- Never claim a definitive diagnosis.
- Clearly mention uncertainty when image quality is poor.
- Highlight urgent red flags that require immediate in-person care.
- Keep output concise, structured, and patient-friendly.
- Do not provide unsafe medication advice.`;

	const ecgHint = ecgPrediction
		? `Auxiliary ECG CNN model output: ${ecgPrediction.label} with confidence ${ecgPrediction.confidence}%. Use this as a supportive signal only, not final diagnosis.`
		: scanType === "ecg"
			? "No auxiliary ECG model output available."
			: "Auxiliary ECG model is not used for non-ECG scans.";

	const userPrompt = `Analyze this uploaded medical image (${scanType.toUpperCase()}) and respond in ${languageName}.
Output format must be:
First line: ACCURACY: <number>%
Then a blank line.
Then a concise markdown report with these sections:
1) **Image Type Guess**
2) **Key Visual Findings**
3) **Possible Interpretation (Non-diagnostic)**
4) **Recommended Next Steps**
5) **Urgent Warning Signs**
6) **Disclaimer**

Use a realistic confidence estimate from 0 to 100 for ACCURACY.
If image quality is insufficient, lower the confidence and state what is missing.
Complete all six sections fully before ending your response.
Additional context: ${ecgHint}`;

	try {
		const text = await generateAnalysisWithRetry(
			systemPrompt,
			userPrompt,
			parsed.base64,
			parsed.mimeType,
		);

		const { accuracy, cleaned } = extractAccuracyAndCleanAnalysis(text);

		res.status(200).json({
			success: true,
			analysis: cleaned || text.trim(),
			accuracy,
			ecgPrediction,
			ecgModelError,
		});
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Unable to analyze image right now.";
		res.status(message.includes("Failed after 3 attempts") ? 503 : 500).json({
			message:
				message,
		});
	}
}
