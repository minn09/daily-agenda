import type { LucideIcon } from "lucide-react";
import { Circle, ListChecks, MessageSquare } from "lucide-react";

export const BULLET_OPTIONS: {
	symbol: string;
	label: string;
	icon: LucideIcon;
}[] = [
	{
		symbol: "•",
		label: "Tarea rápida",
		icon: ListChecks,
	},
	{
		symbol: "–",
		label: "Nota o pensamiento",
		icon: MessageSquare,
	},
	{
		symbol: "○",
		label: "Evento o compromiso",
		icon: Circle,
	},
];
