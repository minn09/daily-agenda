"use client";

import { Bomb, Network, PackageX, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function ThrowError({
	type,
	message,
}: {
	type: "runtime" | "build" | "network";
	message: string;
}): never {
	throw new Error(message);
}

const ERROR_MESSAGES = {
	runtime: "Cannot read properties of undefined (reading 'map')",
	build:
		"Module not found: Can't resolve '@/lib/utils'\n\n./components/ui/button.tsx:5:1\nModule not found: Can't resolve '@/lib/utils'",
	network:
		"FetchError: Network request failed\n  cause: connect ECONNREFUSED 127.0.0.1:3001",
} as const;

function SandboxCard({
	title,
	type,
	trigger,
	setTrigger,
	icon: Icon,
	variant,
}: {
	title: string;
	type: "runtime" | "build" | "network";
	trigger: string | null;
	setTrigger: (v: string | null) => void;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	variant: "destructive" | "warning" | "default";
}) {
	const isActive = trigger === type;

	return (
		<div className="rounded-lg border border-border p-6 space-y-4">
			<div className="flex items-center gap-3">
				<div
					className={`size-10 rounded-full flex items-center justify-center ${
						variant === "destructive"
							? "bg-red-500/10 text-red-500"
							: variant === "warning"
								? "bg-amber-500/10 text-amber-500"
								: "bg-blue-500/10 text-blue-500"
					}`}
				>
					<Icon className="size-5" />
				</div>
				<div>
					<h3 className="font-semibold text-foreground">{title}</h3>
					<p className="text-sm text-muted-foreground">
						Lanza un error para probar el error boundary
					</p>
				</div>
			</div>

			{isActive ? (
				<ThrowError type={type} message={ERROR_MESSAGES[type]} />
			) : (
				<Button
					variant={variant === "destructive" ? "destructive" : "default"}
					onClick={() => setTrigger(type)}
				>
					<Icon className="size-4 mr-2" />
					Lanzar{" "}
					{type === "runtime"
						? "Runtime"
						: type === "build"
							? "Build"
							: "Network"}{" "}
					Error
				</Button>
			)}
		</div>
	);
}

export default function SandboxPage() {
	const [trigger, setTrigger] = useState<string | null>(null);

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<div className="max-w-lg w-full space-y-8">
				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-foreground">Sandbox</h1>
					<p className="text-muted-foreground">
						Probá los diferentes tipos de error que el error boundary captura.
						Cada error se muestra con su tipo, mensaje, y stack trace
						colapsable.
					</p>
				</div>

				<div className="space-y-4">
					<SandboxCard
						title="Runtime Error"
						type="runtime"
						trigger={trigger}
						setTrigger={setTrigger}
						icon={Bomb}
						variant="destructive"
					/>
					<SandboxCard
						title="Build Error"
						type="build"
						trigger={trigger}
						setTrigger={setTrigger}
						icon={PackageX}
						variant="warning"
					/>
					<SandboxCard
						title="Network Error"
						type="network"
						trigger={trigger}
						setTrigger={setTrigger}
						icon={Network}
						variant="default"
					/>
				</div>

				{trigger && (
					<div className="text-center">
						<Button variant="outline" onClick={() => setTrigger(null)}>
							<RefreshCw className="size-4 mr-2" />
							Reiniciar sandbox
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
