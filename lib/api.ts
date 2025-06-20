// API key would typically come from environment variables
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY // This is a demo key, replace with your own
const BASE_URL = process.env.NEXT_PUBLIC_RAWG_BASE_URL

// Map RAWG platform names to our standard platform names
const platformMapping = {
  "PlayStation 5": "PlayStation 5",
  "PlayStation 4": "PlayStation 4",
  "PlayStation 3": "PlayStation 3",
  "PlayStation 2": "PlayStation 2",
  PlayStation: "PlayStation",
  "Xbox Series S/X": "Xbox Series X",
  "Xbox One": "Xbox One",
  "Xbox 360": "Xbox 360",
  Xbox: "Xbox",
  "Nintendo Switch": "Nintendo Switch",
  "Nintendo 3DS": "Nintendo 3DS",
  "Nintendo DS": "Nintendo DS",
  "Wii U": "Wii U",
  Wii: "Wii",
  GameCube: "GameCube",
  "Nintendo 64": "Nintendo 64",
  SNES: "SNES",
  NES: "NES",
  "Game Boy Advance": "Game Boy Advance",
  "Game Boy Color": "Game Boy Color",
  "Game Boy": "Game Boy",
  PC: "PC",
  macOS: "PC",
  Linux: "PC",
  iOS: "Mobile",
  Android: "Mobile",
  PSP: "PSP",
  "PS Vita": "PS Vita",
  Dreamcast: "Dreamcast",
  "Sega Saturn": "Sega Saturn",
  "Sega Genesis": "Sega Genesis",
  "Sega CD": "Sega CD",
  "Sega 32X": "Sega 32X",
  "Game Gear": "Game Gear",
  Atari: "Atari",
}

function mapPlatforms(rawgPlatforms) {
  if (!rawgPlatforms) return []

  const mapped = rawgPlatforms
    .map((p) => platformMapping[p.platform.name] || p.platform.name)
    .filter((platform, index, self) => self.indexOf(platform) === index) // Remove duplicates

  return mapped
}

export async function searchGames(query: string) {
  if (!query || query.length < 3) return []

  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=6`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results.map((game) => ({
      id: game.id,
      title: game.name,
      coverUrl: game.background_image || "/placeholder.svg?height=300&width=200",
      releaseDate: game.released,
      releaseYear: game.released ? new Date(game.released).getFullYear() : null,
      platforms: mapPlatforms(game.platforms),
      rating: game.rating,
      slug: game.slug,
    }))
  } catch (error) {
    console.error("Error searching games:", error)
    return []
  }
}

export async function getGameDetails(gameId: number) {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const game = await response.json()
    const availablePlatforms = mapPlatforms(game.platforms)

    return {
      id: game.id.toString(),
      title: game.name,
      coverUrl: game.background_image || "/placeholder.svg?height=300&width=200",
      releaseDate: game.released || null,
      releaseYear: game.released ? new Date(game.released).getFullYear() : new Date().getFullYear(),
      platform: availablePlatforms.length > 0 ? availablePlatforms[0] : "",
      availablePlatforms: availablePlatforms,
      publisher: game.publishers && game.publishers.length > 0 ? game.publishers[0].name : "",
      condition: "Opened", // Default value
      purchasePrice: 0, // Default value
      currentValue: 0, // Default value
      notes: game.description_raw ? game.description_raw.substring(0, 200) + "..." : "",
      isFavorite: false,
      isWishlist: false,
    }
  } catch (error) {
    console.error("Error fetching game details:", error)
    return null
  }
}
