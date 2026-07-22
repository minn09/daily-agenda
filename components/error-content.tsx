"use client";

import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils";

export function classifyError(message: string): {
	type: string;
	variant: "build" | "runtime" | "network";
} {
	if (
		/module not found|can't resolve|failed to compile|build error/i.test(
			message,
		)
	)
		return { type: "Build Error", variant: "build" };
	if (/network|fetch|request|timeout|abort|connection/i.test(message))
		return { type: "Network Error", variant: "network" };
	return { type: "Runtime Error", variant: "runtime" };
}

interface ErrorContentProps {
	error: Error & { digest?: string };
	title: string;
	resetLabel: string;
	onReset: () => void;
}

export function ErrorContent({
	error,
	title,
	resetLabel,
	onReset,
}: ErrorContentProps) {
	const [showStack, setShowStack] = useState(false);
	const { type, variant } = classifyError(error.message);

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<div className="max-w-2xl w-full space-y-6">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"size-10 rounded-full flex items-center justify-center",
							variant === "build" && "bg-red-500/10 text-red-500",
							variant === "runtime" && "bg-amber-500/10 text-amber-500",
							variant === "network" && "bg-blue-500/10 text-blue-500",
						)}
					>
						{variant === "build" ? (
							<XCircle className="size-5" />
						) : (
							<AlertTriangle className="size-5" />
						)}
					</div>
					<div>
						<p
							className={cn(
								"text-xs font-semibold uppercase tracking-wider",
								variant === "build" && "text-red-500",
								variant === "runtime" && "text-amber-500",
								variant === "network" && "text-blue-500",
							)}
						>
							{type}
						</p>
						<h2 className="text-lg font-bold text-foreground">{title}</h2>
					</div>
				</div>

				<div className="rounded-lg border border-border bg-muted/50 p-4">
					<pre className="text-sm text-foreground whitespace-pre-wrap break-all font-mono leading-relaxed">
						{error.message}
					</pre>
					{error.digest && (
						<p className="mt-2 text-xs text-muted-foreground font-mono">
							digest: {error.digest}
						</p>
					)}
				</div>

				{error.stack && (
					<div className="space-y-2">
						<button
							type="button"
							onClick={() => setShowStack((v) => !v)}
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{showStack ? "Ocultar" : "Mostrar"} stack trace
						</button>
						{showStack && (
							<pre className="rounded-lg border border-border bg-muted/50 p-4 text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
								{error.stack}
							</pre>
						)}
					</div>
				)}

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onReset}
						className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-primary text-primary-foreground shadow-xs hover:bg-primary/80 h-9 px-4 py-2 has-[>svg]:px-3"
					>
						<RefreshCw className="size-4 mr-2" />
						{resetLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
