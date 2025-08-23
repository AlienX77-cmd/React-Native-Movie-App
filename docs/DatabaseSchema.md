# Database Schema Design for React Native Movie App

## Appwrite Database Collections

### 1. SearchAnalytics Collection

**Collection ID**: `${process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID}`

This collection stores search analytics data to track popular searches and generate trending movies.

| Field      | Type   | Description                               |
| ---------- | ------ | ----------------------------------------- |
| $id        | String | Auto-generated unique document ID         |
| searchTerm | String | The search query entered by the user      |
| movie_id   | Number | TMDB ID of the top movie from the search  |
| count      | Number | Number of times this search was performed |
| title      | String | Title of the top movie                    |
| poster_url | String | URL to the movie poster image             |

**Indexes**:

- searchTerm (unique): For quickly looking up existing search terms
- count (ordered): For retrieving trending searches by popularity

### 2. SavedMovies Collection

**Collection ID**: `${process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_ID}`

This collection stores the user's saved/bookmarked movies.

| Field        | Type   | Description                            |
| ------------ | ------ | -------------------------------------- |
| $id          | String | Auto-generated unique document ID      |
| userId       | Number | ID of the user who saved the movie     |
| movieId      | Number | TMDB ID of the saved movie             |
| title        | String | Title of the movie                     |
| poster_url   | String | URL to the movie poster image          |
| vote_average | Number | Average rating of the movie            |
| release_date | String | Release date of the movie              |
| overview     | String | Brief description/summary of the movie |
| savedAt      | String | Timestamp when the movie was saved     |

**Indexes**:

- userId + movieId (compound, unique): For quickly checking if a movie is already saved by a user
- userId (ordered): For retrieving all movies saved by a specific user
- savedAt (ordered): For displaying recently saved movies

## External Data Sources

### TMDB API Data Structure

While not stored directly in our database, understanding the structure of data from TMDB API is important:

#### Movie Object (Basic)

- id: Unique identifier for the movie
- title: Movie title
- poster_path: Path to poster image
- backdrop_path: Path to backdrop image
- overview: Movie description
- release_date: When the movie was released
- vote_average: Rating of the movie
- vote_count: Number of votes

#### Movie Details Object (Extended)

- All fields from basic Movie object
- genres: List of genres
- runtime: Duration of the movie
- budget: Movie's budget
- revenue: Movie's revenue
- production_companies: Companies involved in production
- spoken_languages: Languages available for the movie
- status: Production status

## Data Relationships

1. **User to SavedMovies**: One-to-Many

   - One user can save many movies

2. **SearchTerm to Movie**: Many-to-One
   - Many searches can refer to the same movie

## Future Schema Extensions

### User Collection (for future authentication)

| Field       | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| $id         | String | Auto-generated unique document ID |
| email       | String | User's email address              |
| name        | String | User's display name               |
| preferences | Object | User's movie preferences          |
| createdAt   | String | Account creation timestamp        |
| lastLoginAt | String | Last login timestamp              |

### MovieReviews Collection (for future reviews feature)

| Field     | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| $id       | String | Auto-generated unique document ID   |
| userId    | Number | ID of the user who wrote the review |
| movieId   | Number | TMDB ID of the reviewed movie       |
| rating    | Number | User's rating (1-10)                |
| comment   | String | User's written review               |
| createdAt | String | Review timestamp                    |
