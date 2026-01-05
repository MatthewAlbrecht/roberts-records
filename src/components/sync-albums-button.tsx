"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";

type SyncAlbumsButtonProps = {
	isSyncing: boolean;
	onSync: () => void;
	lastSyncAt?: number;
	variant?: "ghost" | "outline";
	className?: string;
};

function formatRelativeTime(timestamp: number): string {
	const seconds = Math.floor((Date.now() - timestamp) / 1000);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

export function SyncAlbumsButton({
	isSyncing,
	onSync,
	lastSyncAt,
	variant = "ghost",
	className,
}: SyncAlbumsButtonProps) {
	const baseStyles = "flex items-center gap-1.5 text-sm disabled:opacity-50";

	const variantStyles = {
		ghost: "text-muted-foreground hover:text-foreground",
		outline: "rounded-md border px-3 py-1.5 hover:bg-accent",
	};

	return (
		<div className="flex items-center gap-3">
			{lastSyncAt && (
				<span className="text-muted-foreground text-xs">
					Synced {formatRelativeTime(lastSyncAt)}
				</span>
			)}
			<button
				type="button"
				onClick={onSync}
				disabled={isSyncing}
				className={cn(baseStyles, variantStyles[variant], className)}
			>
				<RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
				{isSyncing ? "Syncing..." : "Sync Albums"}
			</button>
		</div>
	);
}
