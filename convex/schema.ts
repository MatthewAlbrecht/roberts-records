import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// Spotify Playlister tables
	spotifyConnections: defineTable({
		userId: v.string(), // Maps to your existing auth user
		accessToken: v.string(),
		refreshToken: v.string(),
		expiresAt: v.number(), // Unix timestamp when access token expires
		spotifyUserId: v.string(), // Spotify's user ID
		displayName: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.index("by_spotifyUserId", ["spotifyUserId"]),

	spotifyPlaylists: defineTable({
		userId: v.string(), // Your auth user
		spotifyPlaylistId: v.string(), // Spotify's playlist ID
		name: v.string(),
		description: v.string(), // AI-generated mood/vibe description for AI matching
		userNotes: v.optional(v.string()), // Original user input for regeneration
		imageUrl: v.optional(v.string()),
		isActive: v.boolean(), // Whether to include in AI suggestions
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.index("by_userId_active", ["userId", "isActive"])
		.index("by_spotifyPlaylistId", ["spotifyPlaylistId"]),

	spotifySongCategorizations: defineTable({
		userId: v.string(),
		trackId: v.string(), // Spotify track ID
		trackName: v.string(),
		artistName: v.string(),
		albumName: v.optional(v.string()),
		albumImageUrl: v.optional(v.string()),
		trackData: v.optional(v.string()), // JSON stringified SpotifyTrack for re-categorization
		userInput: v.string(), // What user typed about the song's vibe
		aiSuggestions: v.array(
			v.object({
				playlistId: v.string(),
				playlistName: v.string(),
				confidence: v.string(), // 'high' | 'medium' | 'low'
				reason: v.string(),
			}),
		),
		finalSelections: v.array(v.string()), // Playlist IDs user confirmed
		createdAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.index("by_trackId", ["trackId"])
		.index("by_userId_createdAt", ["userId", "createdAt"]),

	spotifyTracks: defineTable({
		userId: v.string(),
		trackId: v.string(),
		trackName: v.string(),
		artistName: v.string(),
		albumName: v.optional(v.string()),
		albumImageUrl: v.optional(v.string()),
		spotifyAlbumId: v.optional(v.string()), // Spotify's album ID for grouping
		trackData: v.optional(v.string()), // JSON stringified SpotifyTrack
		firstSeenAt: v.number(),
		lastSeenAt: v.number(),
		lastPlayedAt: v.optional(v.number()),
		lastLikedAt: v.optional(v.number()),
		lastCategorizedAt: v.optional(v.number()),
	})
		.index("by_userId", ["userId"])
		.index("by_userId_trackId", ["userId", "trackId"])
		.index("by_userId_lastSeenAt", ["userId", "lastSeenAt"])
		.index("by_userId_albumId", ["userId", "spotifyAlbumId"])
		.index("by_userId_lastPlayedAt", ["userId", "lastPlayedAt"]),

	spotifyPendingSuggestions: defineTable({
		userId: v.string(),
		trackId: v.string(), // Spotify track ID
		userInput: v.string(), // User's description before submitting
		suggestions: v.array(
			v.object({
				playlistId: v.string(),
				playlistName: v.string(),
				confidence: v.string(), // 'high' | 'medium' | 'low'
				reason: v.string(),
			}),
		),
		createdAt: v.number(),
	})
		.index("by_trackId", ["trackId"])
		.index("by_userId", ["userId"]),

	// Spotify Album tracking tables
	spotifyAlbums: defineTable({
		spotifyAlbumId: v.string(), // Spotify's album ID
		name: v.string(),
		artistName: v.string(),
		imageUrl: v.optional(v.string()),
		releaseDate: v.optional(v.string()),
		totalTracks: v.number(),
		genres: v.optional(v.array(v.string())),
		rawData: v.optional(v.string()), // JSON stringified full Spotify response
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_spotifyAlbumId", ["spotifyAlbumId"])
		.index("by_createdAt", ["createdAt"]),

	userAlbums: defineTable({
		userId: v.string(),
		albumId: v.id("spotifyAlbums"), // Reference to spotifyAlbums
		rating: v.optional(v.number()), // 1-15 rating mapped to tiers (High/Med/Low per tier)
		position: v.optional(v.number()), // Float for ordering within year (fractional indexing)
		category: v.optional(v.string()), // For future use
		firstListenedAt: v.number(),
		lastListenedAt: v.number(),
		listenCount: v.number(), // Denormalized count for quick access
	})
		.index("by_userId", ["userId"])
		.index("by_userId_albumId", ["userId", "albumId"])
		.index("by_userId_lastListenedAt", ["userId", "lastListenedAt"]),

	userAlbumListens: defineTable({
		userId: v.string(),
		albumId: v.id("spotifyAlbums"), // Reference to spotifyAlbums
		listenedAt: v.number(), // Timestamp when we recorded the listen
		earliestPlayedAt: v.number(), // Min played_at from session tracks
		latestPlayedAt: v.number(), // Max played_at from session tracks
		trackIds: v.array(v.string()), // Spotify track IDs that were played
		source: v.string(), // e.g., "recently_played_sync"
	})
		.index("by_userId", ["userId"])
		.index("by_userId_albumId", ["userId", "albumId"])
		.index("by_userId_listenedAt", ["userId", "listenedAt"]),

	spotifySyncLogs: defineTable({
		userId: v.string(),
		syncType: v.string(), // "recently_played" | "liked_tracks"
		rawResponse: v.string(), // JSON blob of Spotify API response
		status: v.string(), // "pending" | "processed" | "failed"
		processedAt: v.optional(v.number()),
		error: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.index("by_status", ["status"])
		.index("by_userId_createdAt", ["userId", "createdAt"]),

	spotifySyncRuns: defineTable({
		userId: v.string(),
		source: v.string(), // "manual" | "cron"
		status: v.string(), // "success" | "failed"
		startedAt: v.number(),
		completedAt: v.number(),
		durationMs: v.number(),
		error: v.optional(v.string()),

		// Track stats
		tracksFromApi: v.number(), // Total tracks returned from Spotify API
		uniqueTracksFromApi: v.number(), // Unique track IDs
		newTracksAdded: v.number(), // Tracks that didn't exist before
		existingTracksUpdated: v.number(), // Tracks that were updated

		// Album stats
		uniqueAlbumsFromApi: v.number(), // Unique album IDs in the API response
		albumsAlreadyInDb: v.number(), // Albums we already had
		newAlbumsDiscovered: v.number(), // New albums fetched from Spotify
		albumsFetchFailed: v.number(), // Albums we couldn't fetch

		// Listen detection stats
		albumsCheckedForListens: v.number(), // Albums evaluated for majority threshold
		albumListensRecorded: v.number(), // Album listens that met threshold

		// Backfill stats
		tracksBackfilledFromAlbums: v.number(), // Tracks added from album discovery

		// Details for debugging
		newAlbumNames: v.optional(v.array(v.string())), // Names of newly discovered albums
		recordedListenAlbumNames: v.optional(v.array(v.string())), // Albums where listens were recorded
	})
		.index("by_userId", ["userId"])
		.index("by_userId_startedAt", ["userId", "startedAt"]),
});

