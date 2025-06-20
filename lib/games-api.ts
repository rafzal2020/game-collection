import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Game = Database["public"]["Tables"]["games"]["Row"]
type GameInsert = Database["public"]["Tables"]["games"]["Insert"]
type GameUpdate = Database["public"]["Tables"]["games"]["Update"]

export const gamesApi = {
  // Get all games for current user
  async getGames(): Promise<Game[]> {
    console.log("gamesApi.getGames called")
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("getGames - Current user:", user?.id)
    
    if (!user) {
      console.error("getGames - No authenticated user found")
      throw new Error("Not authenticated")
    }

    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("getGames - Database error:", error)
      throw error
    }
    
    console.log("getGames - Retrieved", data?.length || 0, "games")
    return data || []
  },

  // Add a new game
  async addGame(game: Omit<GameInsert, "user_id">): Promise<Game> {
    console.log("gamesApi.addGame called with:", game)
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("addGame - Current user:", user?.id)
    
    if (!user) {
      console.error("addGame - No authenticated user found")
      throw new Error("Not authenticated")
    }

    const insertData = {
      ...game,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    console.log("addGame - Inserting data:", insertData)

    const { data, error } = await supabase
      .from("games")
      .insert(insertData)
      .select()
      .single()

    console.log("addGame - Supabase response - data:", data, "error:", error)

    if (error) {
      console.error("addGame - Supabase error:", error)
      throw error
    }
    
    console.log("addGame - Successfully added game:", data)
    return data
  },

  // Update a game
  async updateGame(id: string, updates: Partial<GameUpdate>): Promise<Game> {
    console.log("gamesApi.updateGame called with id:", id, "updates:", updates)
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("updateGame - Current user:", user?.id)
    
    if (!user) {
      console.error("updateGame - No authenticated user found")
      throw new Error("Not authenticated")
    }

    const { data, error } = await supabase
      .from("games")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("updateGame - Supabase error:", error)
      throw error
    }
    
    console.log("updateGame - Successfully updated game:", data)
    return data
  },

  // Delete a game
  async deleteGame(id: string): Promise<void> {
    console.log("gamesApi.deleteGame called with id:", id)
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("deleteGame - Current user:", user?.id)
    
    if (!user) {
      console.error("deleteGame - No authenticated user found")
      throw new Error("Not authenticated")
    }

    const { error } = await supabase.from("games").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("deleteGame - Supabase error:", error)
      throw error
    }
    
    console.log("deleteGame - Successfully deleted game")
  },

  // Check for duplicate games
  async checkDuplicate(title: string, platform: string, isWishlist: boolean, excludeId?: string): Promise<boolean> {
    console.log("checkDuplicate called with:", { title, platform, isWishlist, excludeId })
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("checkDuplicate - Current user:", user?.id)
    
    if (!user) {
      console.error("checkDuplicate - No authenticated user found")
      throw new Error("Not authenticated")
    }

    let query = supabase
      .from("games")
      .select("id")
      .eq("user_id", user.id)
      .ilike("title", title)
      .eq("platform", platform)
      .eq("is_wishlist", isWishlist)

    if (excludeId) {
      query = query.neq("id", excludeId)
    }

    console.log("checkDuplicate - Executing query...")
    const { data, error } = await query
    console.log("checkDuplicate - Response:", { data, error })

    if (error) {
      console.error("checkDuplicate - Error:", error)
      throw error
    }
    
    const isDuplicate = (data?.length || 0) > 0
    console.log("checkDuplicate - Result:", isDuplicate)
    return isDuplicate
  },
}
