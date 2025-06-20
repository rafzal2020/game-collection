"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash2, TrendingUp, TrendingDown, Calendar, Building, Gamepad2, Star, ShoppingCart } from "lucide-react"

// Condition badge colors
const conditionColors = {
  Sealed: "bg-green-500",
  CIB: "bg-blue-500",
  "Disc Only": "bg-yellow-500",
  Digital: "bg-purple-500",
}

export function GameDetailsDialog({
  open,
  onOpenChange,
  game,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMoveToCollection,
}) {
  if (!game) return null

  const isPriceUp = game.currentValue > game.purchasePrice
  const isPriceDown = game.currentValue < game.purchasePrice
  const priceDifference = Math.abs(game.currentValue - game.purchasePrice).toFixed(2)
  const percentChange = (((game.currentValue - game.purchasePrice) / game.purchasePrice) * 100).toFixed(1)

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{game.title}</DialogTitle>
          <DialogDescription>
            View detailed information about this game including condition, value, and notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Image and Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative h-[300px] w-[200px] mx-auto sm:mx-0 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={game.coverUrl || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={`${conditionColors[game.condition] || "bg-gray-500"}`}>{game.condition}</Badge>
                <Badge variant="outline" className="bg-background">
                  <Gamepad2 className="mr-1 h-3 w-3" />
                  {game.platform}
                </Badge>
                {game.isFavorite && !game.isWishlist && (
                  <Badge className="bg-yellow-500">
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    Favorite
                  </Badge>
                )}
                {game.isWishlist && (
                  <Badge className="bg-purple-500">
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Wishlist
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Released:</span>
                  <span>{formatDate(game.releaseDate)}</span>
                </div>
                {game.publisher && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Publisher:</span>
                    <span>{game.publisher}</span>
                  </div>
                )}
              </div>

              {/* Price Information - Only show for collection items */}
              {!game.isWishlist && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Value Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Purchase Price:</span>
                      <p className="font-medium">${game.purchasePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Value:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">${game.currentValue.toFixed(2)}</span>
                        {isPriceUp && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {isPriceDown && <TrendingDown className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  </div>
                  {game.purchasePrice > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Change:</span>
                      <span
                        className={`ml-1 font-medium ${
                          isPriceUp ? "text-green-600" : isPriceDown ? "text-red-600" : "text-muted-foreground"
                        }`}
                      >
                        {isPriceUp ? "+" : ""}${(game.currentValue - game.purchasePrice).toFixed(2)} ({percentChange}%)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          {game.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{game.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {!game.isWishlist && (
              <Button
                variant="outline"
                onClick={() => onToggleFavorite(game.id)}
                className={`flex-1 ${
                  game.isFavorite
                    ? "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100"
                    : "bg-background"
                }`}
              >
                <Star className={`mr-2 h-4 w-4 ${game.isFavorite ? "fill-current" : ""}`} />
                {game.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            )}
            {game.isWishlist && (
              <Button
                variant="outline"
                onClick={() => onMoveToCollection(game.id)}
                className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Move to Collection
              </Button>
            )}
            <Button onClick={onEdit} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit Game
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(game.id)}
              className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
