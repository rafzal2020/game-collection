"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameCard } from "@/components/game-card"
import { AddGameDialog } from "@/components/add-game-dialog"
import { EditGameDialog } from "@/components/edit-game-dialog"
import { GameDetailsDialog } from "@/components/game-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { gamesApi } from "@/lib/games-api"
import { useAuth } from "@/components/auth/auth-provider"

// Expanded platforms list
const platforms = [
  "All Platforms",
  "PlayStation 5",
  "PlayStation 4",
  "PlayStation 3",
  "PlayStation 2",
  "PlayStation",
  "Xbox Series X",
  "Xbox One",
  "Xbox 360",
  "Xbox",
  "Nintendo Switch",
  "Nintendo 3DS",
  "Nintendo DS",
  "Wii U",
  "Wii",
  "GameCube",
  "Nintendo 64",
  "SNES",
  "NES",
  "Game Boy Advance",
  "Game Boy Color",
  "Game Boy",
  "PC",
  "Mobile",
  "PSP",
  "PS Vita",
  "Dreamcast",
  "Sega Saturn",
  "Sega Genesis",
  "Sega CD",
  "Sega 32X",
  "Game Gear",
  "Atari",
]

export function GameCollection() {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("All Platforms")
  const [sortBy, setSortBy] = useState("alphabetical")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editGame, setEditGame] = useState(null)
  const [selectedGame, setSelectedGame] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("collection")
  const [addToWishlist, setAddToWishlist] = useState(false)
  const { toast } = useToast()

  const sortOptions = [
    { value: "alphabetical", label: "A-Z" },
    { value: "platform", label: "Platform" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ]

  // Load games from database
  useEffect(() => {
    if (!user) return

    const loadGames = async () => {
      try {
        const userGames = await gamesApi.getGames()
        setGames(
          userGames.map((game) => ({
            id: game.id,
            title: game.title,
            platform: game.platform,
            coverUrl: game.cover_url || "/placeholder.svg?height=300&width=200",
            condition: game.condition,
            purchasePrice: game.purchase_price,
            currentValue: game.current_value,
            releaseDate: game.release_date,
            releaseYear: game.release_year,
            publisher: game.publisher,
            notes: game.notes,
            isFavorite: game.is_favorite,
            isWishlist: game.is_wishlist,
          })),
        )
      } catch (error) {
        console.error("Error loading games:", error)
        toast({
          title: "Error Loading Games",
          description: "Failed to load your game collection.",
          variant: "destructive",
        })
      } finally {
        setIsLoaded(true)
      }
    }

    loadGames()
  }, [user, toast])

  // Filter and sort games based on current tab and filters
  const getFilteredGames = () => {
    let filteredGames = games

    // Filter by tab
    if (activeTab === "favorites") {
      filteredGames = games.filter((game) => game.isFavorite && !game.isWishlist)
    } else if (activeTab === "wishlist") {
      filteredGames = games.filter((game) => game.isWishlist)
    } else {
      filteredGames = games.filter((game) => !game.isWishlist)
    }

    // Apply search and platform filters
    filteredGames = filteredGames.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlatform = platformFilter === "All Platforms" || game.platform === platformFilter
      return matchesSearch && matchesPlatform
    })

    // Apply sorting
    const sortedGames = [...filteredGames].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "platform":
          if (a.platform === b.platform) {
            return a.title.localeCompare(b.title)
          }
          return a.platform.localeCompare(b.platform)
        case "price-high":
          if (a.isWishlist || b.isWishlist) {
            return a.title.localeCompare(b.title)
          }
          return b.currentValue - a.currentValue
        case "price-low":
          if (a.isWishlist || b.isWishlist) {
            return a.title.localeCompare(b.title)
          }
          return a.currentValue - b.currentValue
        case "newest":
          if (a.releaseYear === b.releaseYear) {
            return a.title.localeCompare(b.title)
          }
          return b.releaseYear - a.releaseYear
        case "oldest":
          if (a.releaseYear === b.releaseYear) {
            return a.title.localeCompare(b.title)
          }
          return a.releaseYear - b.releaseYear
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return sortedGames
  }

  const filteredGames = getFilteredGames()

  // Add a new game
  const handleAddGame = async (newGame) => {
    try {
      console.log("=== Starting handleAddGame ===")
      console.log("Adding game:", newGame)
      console.log("addToWishlist:", addToWishlist)
      
      // Check for duplicates
      console.log("Checking for duplicates...")
      const isDuplicate = await gamesApi.checkDuplicate(newGame.title, newGame.platform, addToWishlist)
      console.log("Duplicate check result:", isDuplicate)

      if (isDuplicate) {
        console.log("Duplicate found, returning early")
        toast({
          title: "Duplicate Game",
          description: `${newGame.title} for ${newGame.platform} already exists in your ${
            addToWishlist ? "wishlist" : "collection"
          }.`,
          variant: "destructive",
        })
        return
      }

      const gameData = {
        title: newGame.title,
        platform: newGame.platform,
        cover_url: newGame.coverUrl,
        condition: newGame.condition || "CIB",
        purchase_price: newGame.purchasePrice || 0,
        current_value: newGame.currentValue || 0,
        release_date: newGame.releaseDate,
        release_year: newGame.releaseYear,
        publisher: newGame.publisher,
        notes: newGame.notes,
        is_favorite: false,
        is_wishlist: addToWishlist,
      }

      console.log("Prepared game data:", gameData)
      console.log("Calling gamesApi.addGame...")
      
      const savedGame = await gamesApi.addGame(gameData)
      console.log("gamesApi.addGame completed, saved game:", savedGame)

      // Create the game object with the correct structure
      const addedGame = {
        id: savedGame.id,
        title: savedGame.title,
        platform: savedGame.platform,
        coverUrl: savedGame.cover_url || "/placeholder.svg?height=300&width=200",
        condition: savedGame.condition,
        purchasePrice: savedGame.purchase_price,
        currentValue: savedGame.current_value,
        releaseDate: savedGame.release_date,
        releaseYear: savedGame.release_year,
        publisher: savedGame.publisher,
        notes: savedGame.notes,
        isFavorite: savedGame.is_favorite,
        isWishlist: savedGame.is_wishlist,
      }

      console.log("Created addedGame object:", addedGame)
      console.log("Current games count:", games.length)
      
      // Update the games state with the new game
      setGames(prevGames => {
        const newGames = [...prevGames, addedGame]
        console.log("New games count:", newGames.length)
        console.log("Updated games array:", newGames)
        return newGames
      })

      console.log("State update completed")

      // Close the dialog and reset state
      setAddDialogOpen(false)
      setAddToWishlist(false)
      
      console.log("Dialog closed and state reset")
      
      toast({
        title: addToWishlist ? "Game Added to Wishlist" : "Game Added",
        description: `${newGame.title} has been added to your ${addToWishlist ? "wishlist" : "collection"}.`,
      })
      
      console.log("=== handleAddGame completed successfully ===")
    } catch (error) {
      console.error("=== Error in handleAddGame ===")
      console.error("Error adding game:", error)
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      // Check if it's an authentication error
      if (error.message === "Not authenticated") {
        console.log("Authentication error detected, attempting to refresh session...")
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        })
        
        // You could add a redirect to login here if needed
        // For now, just show the error toast
      } else {
        toast({
          title: "Error Adding Game",
          description: "Failed to add the game to your collection.",
          variant: "destructive",
        })
      }
    }
  }

  // Delete a game
  const handleDeleteGame = async (id) => {
    try {
      await gamesApi.deleteGame(id)
      const gameToDelete = games.find((game) => game.id === id)
      setGames(games.filter((game) => game.id !== id))
      setSelectedGame(null)
      toast({
        title: "Game Deleted",
        description: `${gameToDelete?.title} has been removed.`,
      })
    } catch (error) {
      console.error("Error deleting game:", error)
      toast({
        title: "Error Deleting Game",
        description: "Failed to delete the game.",
        variant: "destructive",
      })
    }
  }

  // Edit a game
  const handleEditGame = async (updatedGame) => {
    try {
      // Check for duplicates when editing (excluding the current game)
      const isDuplicate = await gamesApi.checkDuplicate(
        updatedGame.title,
        updatedGame.platform,
        updatedGame.isWishlist,
        updatedGame.id,
      )

      if (isDuplicate) {
        toast({
          title: "Duplicate Game",
          description: `${updatedGame.title} for ${updatedGame.platform} already exists in your ${
            updatedGame.isWishlist ? "wishlist" : "collection"
          }.`,
          variant: "destructive",
        })
        return
      }

      const gameData = {
        title: updatedGame.title,
        platform: updatedGame.platform,
        cover_url: updatedGame.coverUrl,
        condition: updatedGame.condition,
        purchase_price: updatedGame.purchasePrice,
        current_value: updatedGame.currentValue,
        release_date: updatedGame.releaseDate,
        release_year: updatedGame.releaseYear,
        publisher: updatedGame.publisher,
        notes: updatedGame.notes,
        is_favorite: updatedGame.isFavorite,
        is_wishlist: updatedGame.isWishlist,
      }

      await gamesApi.updateGame(updatedGame.id, gameData)
      setGames(games.map((game) => (game.id === updatedGame.id ? updatedGame : game)))
      setEditGame(null)
      toast({
        title: "Game Updated",
        description: `${updatedGame.title} has been updated.`,
      })
    } catch (error) {
      console.error("Error updating game:", error)
      toast({
        title: "Error Updating Game",
        description: "Failed to update the game.",
        variant: "destructive",
      })
    }
  }

  // Toggle favorite status
  const handleToggleFavorite = async (id) => {
    try {
      const game = games.find((g) => g.id === id)
      if (!game) return

      await gamesApi.updateGame(id, { is_favorite: !game.isFavorite })
      setGames(games.map((game) => (game.id === id ? { ...game, isFavorite: !game.isFavorite } : game)))

      toast({
        title: game.isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${game.title} ${game.isFavorite ? "removed from" : "added to"} favorites.`,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      })
    }
  }

  // Move from wishlist to collection
  const handleMoveToCollection = async (id) => {
    try {
      const gameToMove = games.find((game) => game.id === id)
      if (!gameToMove) return

      // Check if the game already exists in collection
      const existsInCollection = await gamesApi.checkDuplicate(gameToMove.title, gameToMove.platform, false, id)

      if (existsInCollection) {
        toast({
          title: "Game Already in Collection",
          description: `${gameToMove.title} for ${gameToMove.platform} already exists in your collection.`,
          variant: "destructive",
        })
        return
      }

      await gamesApi.updateGame(id, { is_wishlist: false })
      setGames(games.map((game) => (game.id === id ? { ...game, isWishlist: false } : game)))
      toast({
        title: "Moved to Collection",
        description: `${gameToMove.title} moved from wishlist to collection.`,
      })
    } catch (error) {
      console.error("Error moving to collection:", error)
      toast({
        title: "Error",
        description: "Failed to move game to collection.",
        variant: "destructive",
      })
    }
  }

  // Handle game card click
  const handleGameCardClick = (game) => {
    setSelectedGame(game)
  }

  // Handle edit from details dialog
  const handleEditFromDetails = () => {
    setEditGame(selectedGame)
    setSelectedGame(null)
  }

  // Handle add game button click
  const handleAddGameClick = () => {
    setAddToWishlist(activeTab === "wishlist")
    setAddDialogOpen(true)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your game collection...</p>
        </div>
      </div>
    )
  }

  const collectionGames = games.filter((game) => !game.isWishlist)
  const favoriteGames = games.filter((game) => game.isFavorite && !game.isWishlist)
  const wishlistGames = games.filter((game) => game.isWishlist)

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collection">Collection ({collectionGames.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favoriteGames.length})</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist ({wishlistGames.length})</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddGameClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {activeTab === "wishlist" ? "Add to Wishlist" : "Add Game"}
            </Button>
          </div>

          <TabsContent value="collection" className="space-y-6">
            {/* Collection Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-2xl font-bold">{collectionGames.length}</p>
                <p className="text-xs text-muted-foreground">Total Games</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-2xl font-bold">
                  ${collectionGames.reduce((sum, game) => sum + game.currentValue, 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Collection Value</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-2xl font-bold">
                  ${collectionGames.reduce((sum, game) => sum + game.purchasePrice, 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-2xl font-bold">{new Set(collectionGames.map((game) => game.platform)).size}</p>
                <p className="text-xs text-muted-foreground">Platforms</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Your favorite games from your collection</p>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Games you want to add to your collection</p>
            </div>
          </TabsContent>

          {filteredGames.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30 mt-6">
              <p className="text-muted-foreground">
                {activeTab === "wishlist"
                  ? "No games in your wishlist. Add some games you want to buy!"
                  : activeTab === "favorites"
                    ? "No favorite games yet. Click the star on any game to add it to favorites!"
                    : "No games found. Add some games to your collection!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onCardClick={handleGameCardClick}
                  onToggleFavorite={handleToggleFavorite}
                  onMoveToCollection={handleMoveToCollection}
                  showMoveToCollection={activeTab === "wishlist"}
                />
              ))}
            </div>
          )}
        </div>
      </Tabs>

      <AddGameDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open)
          if (!open) {
            // Reset wishlist state when dialog closes
            setAddToWishlist(false)
          }
        }}
        onAddGame={handleAddGame}
        platforms={platforms.filter((p) => p !== "All Platforms")}
        isWishlist={addToWishlist}
      />

      {editGame && (
        <EditGameDialog
          open={!!editGame}
          onOpenChange={() => setEditGame(null)}
          game={editGame}
          onSave={handleEditGame}
          platforms={platforms.filter((p) => p !== "All Platforms")}
        />
      )}

      <GameDetailsDialog
        open={!!selectedGame}
        onOpenChange={() => setSelectedGame(null)}
        game={selectedGame}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteGame}
        onToggleFavorite={handleToggleFavorite}
        onMoveToCollection={handleMoveToCollection}
      />
    </div>
  )
}
