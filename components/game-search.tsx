"use client"

import { useState, useEffect } from "react"
import { searchGames } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"
import Image from "next/image"
import { useDebounce } from "@/hooks/use-debounce"

export function GameSearch({ onSelectGame }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    const fetchGames = async () => {
      if (debouncedQuery.length < 3) {
        setResults([])
        return
      }

      setLoading(true)
      const games = await searchGames(debouncedQuery)
      setResults(games)
      setLoading(false)
    }

    fetchGames()
  }, [debouncedQuery])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search for a game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {results.map((game) => (
              <button
                key={game.id}
                className="flex items-center gap-3 p-2 hover:bg-muted w-full text-left transition-colors"
                onClick={() => {
                  onSelectGame(game.id)
                  setQuery("")
                  setResults([])
                }}
              >
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={game.coverUrl || "/placeholder.svg?height=300&width=200"}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{game.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {game.releaseYear || "N/A"} • {game.platforms?.slice(0, 2).join(", ")}
                    {game.platforms?.length > 2 ? ", ..." : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query.length >= 3 && results.length === 0 && !loading && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No games found. Try a different search term.
        </div>
      )}
    </div>
  )
}
