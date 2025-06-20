"use client"

import { useState } from "react"
import { GameCollection } from "@/components/game-collection"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Game Collection Manager
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Track, organize, and manage your physical game collection with ease. Keep track of values, conditions, and
              build your wishlist.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="font-semibold mb-2">Track Your Games</h3>
                <p className="text-sm text-muted-foreground">
                  Add games from multiple platforms and track their condition and value
                </p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-3">⭐</div>
                <h3 className="font-semibold mb-2">Favorites & Wishlist</h3>
                <p className="text-sm text-muted-foreground">
                  Mark your favorite games and maintain a wishlist of games to buy
                </p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">Collection Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  View your collection value, statistics, and track price trends
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setAuthDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started - Sign In or Sign Up
            </Button>
          </div>
        </div>

        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Game Collection</h1>
          <p className="text-muted-foreground">Welcome back, {user.display_name || user.email?.split("@")[0]}!</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      <GameCollection />
    </div>
  )
}
