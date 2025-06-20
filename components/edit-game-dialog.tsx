"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const conditionOptions = ["CIB", "Sealed", "Disc Only", "Digital"]

export function EditGameDialog({ open, onOpenChange, game, onSave, platforms }) {
  const [gameData, setGameData] = useState(game)

  // Update form when game changes
  useEffect(() => {
    setGameData(game)
  }, [game])

  const handleChange = (field, value) => {
    setGameData({ ...gameData, [field]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(gameData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogDescription>
            Update the details of your game. You can modify any information including condition, price, and notes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={gameData.title} onChange={(e) => handleChange("title", e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={gameData.platform} onValueChange={(value) => handleChange("platform", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!gameData.isWishlist && (
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

          {!gameData.isWishlist && (
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
