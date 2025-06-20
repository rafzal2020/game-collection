"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameSearch } from "@/components/game-search"
import { getGameDetails } from "@/lib/api"
import { Loader2 } from "lucide-react"

const conditionOptions = ["CIB", "Sealed", "Disc Only", "Digital"]

const initialGameState = {
  title: "",
  platform: "",
  coverUrl: "/placeholder.svg?height=300&width=200",
  condition: "Opened",
  purchasePrice: 0,
  currentValue: 0,
  releaseDate: null,
  releaseYear: new Date().getFullYear(),
  publisher: "",
  notes: "",
}

export function AddGameDialog({ open, onOpenChange, onAddGame, platforms, isWishlist = false }) {
  const [gameData, setGameData] = useState(initialGameState)
  const [activeTab, setActiveTab] = useState("search")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [availablePlatforms, setAvailablePlatforms] = useState([])

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setGameData(initialGameState)
      setActiveTab("search")
      setAvailablePlatforms([])
    }
  }, [open])

  const handleChange = (field, value) => {
    setGameData({ ...gameData, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("AddGameDialog - Form submitted with data:", gameData)
    
    setSubmitting(true)
    try {
      await onAddGame(gameData)
      console.log("AddGameDialog - onAddGame completed successfully")
      
      // Reset form after successful submission
      setGameData(initialGameState)
      setActiveTab("search")
      setAvailablePlatforms([])
      console.log("AddGameDialog - Form reset completed")
    } catch (error) {
      console.error("AddGameDialog - Error in form submission:", error)
      // Don't reset the form if there was an error
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectGame = async (gameId) => {
    setLoading(true)
    try {
      const gameDetails = await getGameDetails(gameId)
      if (gameDetails) {
        setGameData({
          ...gameDetails,
          platform: gameDetails.availablePlatforms.length > 0 ? gameDetails.availablePlatforms[0] : "",
        })
        setAvailablePlatforms(gameDetails.availablePlatforms)
        setActiveTab("manual")
      }
    } catch (error) {
      console.error("Error fetching game details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    if (value === "search") {
      // Reset available platforms when switching back to search
      setAvailablePlatforms([])
      setGameData(initialGameState)
    }
  }

  // Use dynamic platforms if available, otherwise use static platforms
  const platformOptions = availablePlatforms.length > 0 ? availablePlatforms : platforms

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isWishlist ? "Add to Wishlist" : "Add New Game"}</DialogTitle>
          <DialogDescription>
            {isWishlist 
              ? "Add a game to your wishlist to track games you want to buy."
              : "Add a new game to your collection with details like condition, price, and notes."
            }
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading game details...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Game</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="py-4">
              <GameSearch onSelectGame={handleSelectGame} />
              <p className="text-xs text-muted-foreground mt-4">
                Search for a game to automatically fill in details. You can edit any information after selecting a game.
              </p>
            </TabsContent>

            <TabsContent value="manual">
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={gameData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={gameData.platform} onValueChange={(value) => handleChange("platform", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availablePlatforms.length > 0 && (
                    <p className="text-xs text-muted-foreground">Showing platforms available for this game</p>
                  )}
                </div>

                {!isWishlist && (
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={gameData.condition} onValueChange={(value) => handleChange("condition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOptions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {!isWishlist && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={gameData.purchasePrice}
                        onChange={(e) => handleChange("purchasePrice", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currentValue">Current Value ($)</Label>
                      <Input
                        id="currentValue"
                        type="number"
                        step="0.01"
                        min="0"
                        value={gameData.currentValue}
                        onChange={(e) => handleChange("currentValue", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="releaseYear">Release Year</Label>
                    <Input
                      id="releaseYear"
                      type="number"
                      min="1970"
                      max={new Date().getFullYear()}
                      value={gameData.releaseYear}
                      onChange={(e) =>
                        handleChange("releaseYear", Number.parseInt(e.target.value) || new Date().getFullYear())
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={gameData.publisher}
                      onChange={(e) => handleChange("publisher", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="coverUrl">Cover Image URL</Label>
                  <Input
                    id="coverUrl"
                    value={gameData.coverUrl}
                    onChange={(e) => handleChange("coverUrl", e.target.value)}
                    placeholder="URL to game cover image"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={gameData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any special notes about this game (condition details, special editions, etc.)"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isWishlist ? "Add to Wishlist" : "Add Game"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
