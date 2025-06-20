import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

console.log("Initializing Supabase client with URL:", supabaseUrl)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase.auth.getUser().then(({ data, error }) => {
  console.log("Supabase connection test - User:", data.user?.id, "Error:", error)
}).catch(err => {
  console.error("Supabase connection test failed:", err)
})

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          user_id: string
          title: string
          platform: string
          cover_url: string | null
          condition: string
          purchase_price: number
          current_value: number
          release_date: string | null
          release_year: number
          publisher: string | null
          notes: string | null
          is_favorite: boolean
          is_wishlist: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          platform: string
          cover_url?: string | null
          condition: string
          purchase_price?: number
          current_value?: number
          release_date?: string | null
          release_year: number
          publisher?: string | null
          notes?: string | null
          is_favorite?: boolean
          is_wishlist?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          platform?: string
          cover_url?: string | null
          condition?: string
          purchase_price?: number
          current_value?: number
          release_date?: string | null
          release_year?: number
          publisher?: string | null
          notes?: string | null
          is_favorite?: boolean
          is_wishlist?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
