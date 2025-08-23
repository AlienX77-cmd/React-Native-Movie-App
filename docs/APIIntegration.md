# API Integration Documentation for React Native Movie App

## 1. TMDB API Integration

The Movie Database (TMDB) API provides comprehensive movie data used throughout the application.

### 1.1. Configuration

```typescript
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};
```

### 1.2. Endpoints Used

| Endpoint          | Description                                     | Function              |
| ----------------- | ----------------------------------------------- | --------------------- |
| `/search/movie`   | Search movies by query term                     | `fetchMovies()`       |
| `/discover/movie` | Discover movies sorted by popularity            | `fetchMovies()`       |
| `/movie/{id}`     | Get detailed information about a specific movie | `fetchMovieDetails()` |

### 1.3. Implementation Details

#### Movie Search and Discovery

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

#### Movie Details

```typescript
export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
```

## 2. Appwrite Backend Integration

Appwrite is used as a Backend-as-a-Service (BaaS) to handle user data, saved movies, and search analytics.

### 2.1. Configuration

```typescript
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
```

### 2.2. Appwrite Services

#### Search Analytics Service

Tracks search terms and popular movies to generate trending content.

```typescript
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    // Check if a record of that search has already been stored
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
```

#### Trending Movies Service

Retrieves the most searched/popular movies.

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

#### Saved Movies Service

Manages user's saved/bookmarked movies.

```typescript
// Save a movie
export const saveMovie = async (userId: number, movie: MovieDetails) => {
  try {
    const existingDoc = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movieId", movie.id)]
    );

    if (existingDoc.documents.length > 0) {
      return existingDoc.documents[0];
    }

    const result = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        userId: userId,
        movieId: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        vote_average: Math.round(movie.vote_average),
        release_date: movie.release_date,
        overview: movie.overview,
        savedAt: new Date().toISOString(),
      }
    );

    return result;
  } catch (error) {
    console.log("Error saving movies:", error);
    throw error;
  }
};
```

## 3. Data Fetching Hook

The application uses a custom hook to handle data fetching, loading states, and error handling:

```typescript
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unexpected error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
};
```

## 4. Event System

The application uses an event-based system to communicate between components:

```typescript
import { EventEmitter } from "events";

export const appEvents = new EventEmitter();
export const SEARCH_PERFORMED = "search_performed";
export const TRENDING_UPDATED = "trending_updated";

export const movieSaveEvents = new EventEmitter();
export const MOVIE_SAVED_EVENT = "movie_saved";
export const MOVIE_UNSAVED_EVENT = "movie_unsaved";
```

## 5. Environment Variables

The application uses the following environment variables:

```env
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_ID=your_appwrite_saved_movies_id
```

## 6. API Error Handling

The application implements error handling for API calls:

```typescript
try {
  // API call
} catch (error) {
  console.error("Error message:", error);
  // Handle error (display message, retry, etc.)
} finally {
  // Clean up (e.g., stop loading indicator)
}
```
