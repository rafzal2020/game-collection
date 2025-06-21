# Game Collection Manager

A modern web application for tracking, organizing, and managing your physical game collection. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎮 **Game Collection Management**: Add, edit, and delete games from your collection
- 📊 **Collection Analytics**: Track collection value, total spent, and platform statistics
- ⭐ **Favorites System**: Mark your favorite games for quick access
- 🛒 **Wishlist Management**: Maintain a wishlist of games you want to buy
- 🔍 **Search & Filter**: Search games by title and filter by platform
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔐 **User Authentication**: Secure user accounts with Supabase Auth
- 💾 **Database Storage**: Persistent data storage with Supabase

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- A Supabase account and project

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/game-collection.git
cd game-collection
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

You can find these values in your Supabase project dashboard under **Project Settings > API**.

### 4. Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Create a new query and run the contents of `scripts/create-tables.sql`
4. This will create the necessary tables and security policies

### 5. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The application uses two main tables:

### Games Table
- `id`: Unique identifier
- `user_id`: User who owns the game
- `title`: Game title
- `platform`: Gaming platform (PS5, Xbox, Switch, etc.)
- `cover_url`: URL to game cover image
- `condition`: Game condition (CIB, Sealed, Disc Only, Digital)
- `purchase_price`: Price paid for the game
- `current_value`: Current estimated value
- `release_date`: Game release date
- `release_year`: Game release year
- `publisher`: Game publisher
- `notes`: Additional notes
- `is_favorite`: Whether the game is marked as favorite
- `is_wishlist`: Whether the game is in wishlist
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### Profiles Table
- `id`: User ID (references auth.users)
- `email`: User email
- `display_name`: User display name
- `avatar_url`: User avatar URL
- `created_at`: Profile creation timestamp
- `updated_at`: Profile update timestamp

## Features in Detail

### Game Management
- **Add Games**: Add games manually or search for them using the integrated game search
- **Edit Games**: Update game details including condition, price, and notes
- **Delete Games**: Remove games from your collection
- **Game Details**: View comprehensive game information in a detailed dialog

### Collection Analytics
- **Total Games**: Count of games in your collection
- **Collection Value**: Total current value of all games
- **Total Spent**: Total amount spent on games
- **Platforms**: Number of different platforms in your collection

### Search and Filtering
- **Search**: Search games by title
- **Platform Filter**: Filter games by platform
- **Sorting**: Sort by alphabetical, platform, price, or release date
- **Tabs**: Separate views for collection, favorites, and wishlist

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback
