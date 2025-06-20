"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, type AuthUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (displayName: string) => Promise<void>
  ensureProfile: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Ensure profile exists for authenticated user
  const ensureProfile = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        console.log("No authenticated user found in ensureProfile")
        return
      }

      console.log("Ensuring profile for user:", authUser.id)

      // Check if profile exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", authUser.id).single()

      // Create profile if it doesn't exist
      if (!existingProfile) {
        console.log("Creating new profile for user:", authUser.id)
        const { error } = await supabase.from("profiles").insert({
          id: authUser.id,
          email: authUser.email!,
          display_name: authUser.user_metadata?.display_name || null,
        })

        if (error) {
          console.error("Error creating profile:", error)
        } else {
          console.log("Profile created successfully")
        }
      } else {
        console.log("Profile already exists for user:", authUser.id)
      }
    } catch (error) {
      console.error("Error in ensureProfile:", error)
    }
  }

  // Refresh session manually
  const refreshSession = async () => {
    try {
      console.log("Refreshing session...")
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error("Session refresh error:", error)
        setUser(null)
        return
      }

      if (data.user) {
        console.log("Session refreshed successfully for user:", data.user.id)
        await ensureProfile()
        const updatedUser = await auth.getCurrentUser()
        setUser(updatedUser)
      } else {
        console.log("No user found after session refresh")
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    console.log("AuthProvider: Initializing...")
    
    // Get initial user and session
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        console.log("Initial session check:", session ? "Session exists" : "No session")

        if (session) {
          // Session exists, get user
          const user = await auth.getCurrentUser()
          console.log("Initial user:", user ? user.id : "No user")
          
          if (user) {
            await ensureProfile()
            const updatedUser = await auth.getCurrentUser()
            setUser(updatedUser)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session ? "Session exists" : "No session")
      
      try {
        if (session?.user) {
          console.log("User authenticated:", session.user.id)
          await ensureProfile()
          const user = await auth.getCurrentUser()
          setUser(user)
        } else {
          console.log("User signed out or session expired")
          setUser(null)
        }
      } catch (error) {
        console.error("Error in auth state change handler:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      console.log("AuthProvider: Cleaning up subscription")
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email)
      await auth.signIn(email, password)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      console.log("Signing up user:", email)
      await auth.signUp(email, password, displayName)
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      })
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out user")
      await auth.signOut()
      setUser(null)
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })
    } catch (error: any) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProfile = async (displayName: string) => {
    try {
      console.log("Updating profile for user:", user?.id)
      await auth.updateProfile(displayName)
      setUser(user ? { ...user, display_name: displayName } : null)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        ensureProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
