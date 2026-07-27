"use client";

import { motion } from "framer-motion";
import { BULLET_OPTIONS } from "@/constants/bullets";
import { cn } from "@/utils";

interface BulletBarProps {
	onInsert: (symbol: string) => void;
	zenMode?: boolean;
}

export function BulletBar({ onInsert, zenMode }: BulletBarProps) {
	return (
		<div className={cn("flex items-center gap-1", zenMode && "justify-center")}>
			{BULLET_OPTIONS.map((opt) => {
				const Icon = opt.icon;
				return (
					<motion.button
						key={opt.symbol}
						type="button"
						onClick={() => onInsert(opt.symbol)}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
						className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-muted/50 transition-colors cursor-pointer select-none"
					>
						<Icon className="w-3 h-3" />
						<span>{opt.label}</span>
						<kbd className="ml-0.5 px-1 py-0.5 text-[10px] font-mono rounded bg-muted/60 text-muted-foreground/40 leading-none">
							{opt.trigger}
						</kbd>
					</motion.button>
				);
			})}
		</div>
	);
}
