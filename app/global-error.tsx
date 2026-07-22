"use client";

import { ErrorContent } from "@/components/error-content";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body className="bg-background text-foreground antialiased">
				<ErrorContent
					error={error}
					title="Error crítico"
					resetLabel="Recargar"
					onReset={reset}
				/>
			</body>
		</html>
	);
}
