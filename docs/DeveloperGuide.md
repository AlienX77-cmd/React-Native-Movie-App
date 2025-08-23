# React Native Movie App - Developer Guide

## Overview

This document serves as a developer guide for the React Native Movie App, covering project setup, code organization, and best practices for future development.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Project Structure](#project-structure)
3. [Key Features Implementation](#key-features-implementation)
4. [Styling with NativeWind](#styling-with-nativewind)
5. [Navigation](#navigation)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Appwrite Backend](#appwrite-backend)
9. [Testing](#testing)
10. [Performance Optimization](#performance-optimization)
11. [Troubleshooting](#troubleshooting)

## Project Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- React Native development environment

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AlienX77-cmd/React-Native-Movie-App.git
   cd React-Native-Movie-App
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:

   ```
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
   EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_ID=your_appwrite_saved_movies_id
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Project Structure

The project follows a feature-based architecture:

```
React-Native-Movie-App/
├── app/                    # Expo Router screens and navigation
│   ├── (tabs)/             # Tab navigation screens
│   │   ├── _layout.tsx     # Tab navigation setup
│   │   ├── index.tsx       # Home screen
│   │   ├── search.tsx      # Search screen
│   │   ├── saved.tsx       # Saved movies screen
│   │   └── profile.tsx     # User profile screen
│   ├── movie/              # Movie details screens
│   │   └── [id].tsx        # Dynamic route for movie details
│   ├── _layout.tsx         # Root navigation layout
│   └── global.css          # Global styles
├── assets/                 # Static assets (images, fonts, icons)
│   ├── fonts/              # Custom fonts
│   ├── icons/              # App icons
│   └── images/             # App images
├── components/             # Reusable UI components
│   ├── MovieCard.tsx       # Movie card component
│   ├── SaveButton.tsx      # Save/bookmark button
│   ├── SearchBar.tsx       # Search input component
│   └── TrendingCard.tsx    # Trending movies card
├── constants/              # App constants
│   ├── icons.ts            # Icon references
│   └── images.ts           # Image references
├── interfaces/             # TypeScript interfaces
│   └── interfaces.d.ts     # Type definitions
├── services/               # API and backend services
│   ├── api.ts              # TMDB API integration
│   ├── appwrite.ts         # Appwrite backend integration
│   ├── eventEmitter.ts     # Event system
│   ├── savedMovies.ts      # Saved movies management
│   └── useFetch.ts         # Custom data fetching hook
├── types/                  # Additional type definitions
│   └── images.d.ts         # Image module declarations
├── docs/                   # Documentation
├── .env                    # Environment variables
└── package.json            # Project dependencies and scripts
```

## Key Features Implementation

### Search Functionality

The search functionality is implemented in the `search.tsx` screen using:

1. The `SearchBar` component for user input
2. A debounced search to prevent excessive API calls
3. The `fetchMovies` function from the API service
4. The `updateSearchCount` function to track popular searches

```tsx
// Debounced search implementation
useEffect(() => {
  const timeoutId = setTimeout(async () => {
    if (searchQuery.trim()) {
      await loadMovies();
      appEvents.emit(SEARCH_PERFORMED, searchQuery);
    } else {
      reset();
    }
  }, 500);

  return () => clearTimeout(timeoutId);
}, [searchQuery]);
```

### Saving Movies

The save feature is implemented using:

1. The `SaveButton` component
2. The `savedMovies.ts` service for Appwrite interactions
3. The event system for cross-component communication

```tsx
// Save button logic
const handleSave = async () => {
  try {
    if (saved) {
      await unsaveMovie(userId, movie.id);
      setSaved(false);
      movieSaveEvents.emit(MOVIE_UNSAVED_EVENT);
    } else {
      await saveMovie(userId, movie);
      setSaved(true);
      movieSaveEvents.emit(MOVIE_SAVED_EVENT);
    }
  } catch (error) {
    console.error("Error saving movie:", error);
  }
};
```

### Trending Movies

Trending movies are calculated based on search analytics stored in Appwrite:

```typescript
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
```

## Styling with NativeWind

The project uses NativeWind (Tailwind CSS for React Native) for styling:

1. Tailwind classes are used directly in components:

   ```tsx
   <View className="flex-1 bg-primary p-4">
     <Text className="text-light-100 font-bold text-lg">Title</Text>
   </View>
   ```

2. The color scheme is defined in `tailwind.config.js`:
   ```javascript
   // Example tailwind configuration
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: "#151312",
           secondary: "#caff3f",
           dark: {
             100: "#151312",
             200: "#1A1C20",
           },
           light: {
             100: "#FFFFFF",
             200: "#E5E7EB",
             300: "#A8B5DB",
           },
         },
       },
     },
   };
   ```

## Navigation

The app uses Expo Router for file-based navigation:

1. Tab Navigation (`app/(tabs)/_layout.tsx`):

   - Home (index.tsx)
   - Search (search.tsx)
   - Saved (saved.tsx)
   - Profile (profile.tsx)

2. Stack Navigation for Movie Details (`app/_layout.tsx`):
   - Dynamic routing with `[id].tsx` for movie details

## State Management

The app uses a combination of:

1. Local state with React's `useState` for component-specific state
2. Custom hooks for shared logic (e.g., `useFetch`)
3. Event emitters for cross-component communication

```typescript
// Event emitter for app-wide communication
export const appEvents = new EventEmitter();
export const SEARCH_PERFORMED = "search_performed";
export const TRENDING_UPDATED = "trending_updated";

export const movieSaveEvents = new EventEmitter();
export const MOVIE_SAVED_EVENT = "movie_saved";
export const MOVIE_UNSAVED_EVENT = "movie_unsaved";
```

## API Integration

TMDB API integration is handled in the `api.ts` service:

```typescript
export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies: " + response.statusText);
  }

  const data = await response.json();
  return data.results;
};
```

## Appwrite Backend

Appwrite integration is implemented in the `appwrite.ts` and `savedMovies.ts` services:

```typescript
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
```

Key Appwrite features used:

1. Database collections for saved movies and search analytics
2. Document creation, retrieval, and deletion
3. Queries for filtering and sorting data

## Testing

For implementing tests:

1. Unit tests with Jest for services and utilities
2. Component tests with React Native Testing Library
3. End-to-end tests with Detox

```bash
# Run tests
npm test
```

## Performance Optimization

Key performance optimizations:

1. Debounced search to prevent excessive API calls
2. Image optimization with appropriate sizing
3. List virtualization for long scrollable lists
4. Memoization of expensive computations
5. Lazy loading of non-critical screens

## Troubleshooting

Common issues and solutions:

1. API Key Issues

   - Verify the TMDB API key is correctly set in the `.env` file
   - Check that environment variables are properly accessed

2. Appwrite Connection Issues

   - Verify Appwrite Project ID and other credentials
   - Check network connectivity to Appwrite services

3. Build Errors

   - Run `npm install` to ensure all dependencies are installed
   - Clear cache with `npm start -- --reset-cache`

4. UI Issues
   - Check NativeWind setup and configuration
   - Verify that global.css is properly imported
