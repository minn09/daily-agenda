import type { LucideIcon } from "lucide-react";
import { Circle, ListChecks, MessageSquare } from "lucide-react";

export const BULLET_OPTIONS: {
	symbol: string;
	trigger: string;
	label: string;
	icon: LucideIcon;
}[] = [
	{
		symbol: "•",
		trigger: "(",
		label: "Tarea rápida",
		icon: ListChecks,
	},
	{
		symbol: "–",
		trigger: "-",
		label: "Nota o pensamiento",
		icon: MessageSquare,
	},
	{
		symbol: "○",
		trigger: ")",
		label: "Evento o compromiso",
		icon: Circle,
	},
];
