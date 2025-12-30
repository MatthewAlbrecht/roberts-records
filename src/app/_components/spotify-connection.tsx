"use client";

import { useMutation } from "convex/react";
import { Music2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

type SpotifyConnectionProps = {
	isConnected: boolean;
	displayName?: string;
	userId: string | null;
};

export function SpotifyConnection({
	isConnected,
	displayName,
	userId,
}: SpotifyConnectionProps) {
	const deleteConnection = useMutation(api.spotify.deleteConnection);

	async function handleDisconnect() {
		if (!userId) return;
		try {
			await deleteConnection({ userId });
			toast.success("Disconnected from Spotify");
		} catch {
			toast.error("Failed to disconnect");
		}
	}

	// Don't show anything when not connected
	if (!isConnected) {
		return (
			<Card>
				<CardContent className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<Music2 className="h-5 w-5 text-muted-foreground" />
						<div>
							<p className="font-medium">Connect your Spotify account</p>
							<p className="text-muted-foreground text-sm">
								Required to access your recently played songs and playlists
							</p>
						</div>
					</div>
					<Button asChild>
						<a href="/api/spotify/auth">Connect Spotify</a>
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Show disconnect option when connected
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					<Music2 className="h-5 w-5 text-green-500" />
					<div>
						<p className="font-medium">
							Connected to Spotify{displayName ? ` as ${displayName}` : ""}
						</p>
						<p className="text-muted-foreground text-sm">
							You can sync your listening history and manage albums
						</p>
					</div>
				</div>
				<Button variant="outline" onClick={handleDisconnect}>
					Disconnect
				</Button>
			</CardContent>
		</Card>
	);
}
