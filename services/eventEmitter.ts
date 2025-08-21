import { EventEmitter } from "events";

export const appEvents = new EventEmitter();
export const SEARCH_PERFORMED = "search_performed";
export const TRENDING_UPDATED = "trending_updated";

// Create a simple event system for movie saves
export const movieSaveEvents = new EventEmitter();
export const MOVIE_SAVED_EVENT = "movie_saved";
export const MOVIE_UNSAVED_EVENT = "movie_unsaved";
