import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  display_name?: string
}

export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) throw error
    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get profile data
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()

    return {
      ...user,
      display_name: profile?.display_name || user.user_metadata?.display_name,
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  },

  // Update profile
  async updateProfile(displayName: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("No user logged in")

    // Upsert profile (insert or update)
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email!,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error
  },
}
