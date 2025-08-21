import { Client, Databases, ID, Query } from "react-native-appwrite";

// saved movies logic
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

// Save a movie to the user's saved list
export const saveMovie = async (userId: number, movie: MovieDetails) => {
  try {
    // Check if movie is already saved
    const existingDoc = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movieId", movie.id)]
    );

    if (existingDoc.documents.length > 0) {
      // Movie already saved
      return existingDoc.documents[0];
    }

    // Save new movie
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

export const unsaveMovie = async (userId: number, movieId: number) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("movieId", movieId),
    ]);

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        result.documents[0].$id
      );
      return true;
    }

    return false;
  } catch (error) {
    console.log("Error removing saved movie:", error);
    throw error;
  }
};

// Get all saved movies for a user
export const getSavedMovies = async (userId: number): Promise<Movie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);

    // Convert to Movie type
    return result.documents.map((doc) => ({
      id: doc.movieId,
      title: doc.title,
      poster_path: doc.poster_url,
      vote_average: doc.vote_average,
      release_date: doc.release_date,
      overview: doc.overview,
      // Add other required Movie fields with defaults
      adult: false,
      backdrop_path: "",
      genre_ids: [],
      original_language: "",
      original_title: doc.title,
      popularity: 0,
      video: false,
      vote_count: 0,
    }));
  } catch (error) {
    console.log("Error fetching saved movies:", error);
    return [];
  }
};

// Check if a movie is saved
export const isMovieSaved = async (
  userId: number,
  movieId: number
): Promise<boolean> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("movieId", movieId),
    ]);

    return result.documents.length > 0;
  } catch (error) {
    console.log("Error checking saved status:", error);
    return false;
  }
};

export const getSavedMoviesCount = async (userId: number): Promise<number> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);

    return result.total;
  } catch (error) {
    console.error("Error fetching saved movies count:", error);
    return 0;
  }
};
