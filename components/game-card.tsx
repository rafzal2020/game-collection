"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown, ShoppingCart } from "lucide-react"

// Condition badge colors
const conditionColors = {
  Sealed: "bg-green-500",
  CIB: "bg-blue-500",
  "Disc Only": "bg-yellow-500",
  Digital: "bg-purple-500",
}

export function GameCard({ game, onCardClick, onToggleFavorite, onMoveToCollection, showMoveToCollection = false }) {
  const isPriceUp = game.currentValue > game.purchasePrice
  const isPriceDown = game.currentValue < game.purchasePrice

  const handleStarClick = (e) => {
    e.stopPropagation()
    onToggleFavorite(game.id)
  }

  const handleMoveClick = (e) => {
    e.stopPropagation()
    onMoveToCollection(game.id)
  }

  return (
    <Card
      className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onCardClick(game)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative h-[200px] w-full">
          <Image src={game.coverUrl || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
        </div>
        <Badge className={`absolute top-2 left-2 ${conditionColors[game.condition] || "bg-gray-500"}`}>
          {game.condition}
        </Badge>
        <div className="absolute top-2 right-2 flex gap-2">
          {!game.isWishlist && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                game.isFavorite
                  ? "bg-yellow-500/90 text-white hover:bg-yellow-600/90"
                  : "bg-black/50 text-white hover:bg-black/70"
              }`}
              onClick={handleStarClick}
            >
              <Star className={`h-4 w-4 ${game.isFavorite ? "fill-current" : ""}`} />
            </Button>
          )}
          {showMoveToCollection && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-green-500/90 text-white hover:bg-green-600/90"
              onClick={handleMoveClick}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-bold text-lg line-clamp-2 mb-1">{game.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {game.platform} • {game.releaseYear}
        </p>

        {!game.isWishlist && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">${game.currentValue.toFixed(2)}</span>
              {isPriceUp && <TrendingUp className="ml-1 h-4 w-4 text-green-500" />}
              {isPriceDown && <TrendingDown className="ml-1 h-4 w-4 text-red-500" />}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 text-xs text-muted-foreground">{game.publisher}</CardFooter>
    </Card>
  )
}
