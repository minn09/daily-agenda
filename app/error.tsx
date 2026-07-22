"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/components/error-content";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<ErrorContent
			error={error}
			title="Algo salió mal"
			resetLabel="Intentar de nuevo"
			onReset={reset}
		/>
	);
}
