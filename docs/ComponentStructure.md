# React Native Movie App - Component Structure

## UI Component Overview

This document provides detailed information about the key UI components used in the React Native Movie App.

## 1. MovieCard Component

### Purpose

Displays concise information about a movie in a visually appealing card format.

### Usage

```tsx
<MovieCard movie={movieObject} />
```

### Implementation

```tsx
// Based on the project structure, actual implementation may vary
const MovieCard = ({ movie }: { movie: Movie }) => (
  <TouchableOpacity
    className="rounded-lg overflow-hidden bg-dark-100 shadow-md"
    onPress={() => router.push(`/movie/${movie.id}`)}
  >
    <Image
      source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
      className="h-40 w-full"
      resizeMode="cover"
    />
    <View className="p-3">
      <Text className="text-light-100 font-bold text-base">{movie.title}</Text>
      <Text className="text-light-300 text-sm">{movie.release_date}</Text>
      <View className="flex-row items-center mt-2">
        <Image source={icons.star} className="h-4 w-4 mr-1" />
        <Text className="text-light-200">{movie.vote_average}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
```

### Props

- `movie`: Movie object containing details like id, title, poster_path, etc.

## 2. SearchBar Component

### Purpose

Allows users to search for movies by title.

### Usage

```tsx
<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search for movies..."
/>
```

### Implementation

```tsx
// Based on the project structure, actual implementation may vary
const SearchBar = ({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) => (
  <View className="flex-row items-center bg-dark-200 rounded-full px-4 py-2">
    <Image source={icons.search} className="h-5 w-5 mr-2" tintColor="#A8B5DB" />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || "Search..."}
      placeholderTextColor="#A8B5DB"
      className="flex-1 text-light-100"
    />
  </View>
);
```

### Props

- `value`: Current search text
- `onChangeText`: Function to handle text changes
- `placeholder`: Optional placeholder text

## 3. SaveButton Component

### Purpose

Button that allows users to save/unsave movies to their personal collection.

### Usage

```tsx
<SaveButton movie={movieDetails} userId={1} />
```

### Implementation

```tsx
const SaveButton = ({
  movie,
  userId,
  size = 24,
  onSaveStatusChange,
}: SaveButtonProps) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSaveStatus = async () => {
      setLoading(true);
      const isSaved = await isMovieSaved(userId, movie.id);
      setSaved(isSaved);
      setLoading(false);
    };

    checkSaveStatus();
  }, [movie.id, userId]);

  const handleSave = async () => {
    try {
      if (saved) {
        await unsaveMovie(userId, movie.id);
        setSaved(false);
        onSaveStatusChange?.(false);
        // Emit unsave event
        movieSaveEvents.emit(MOVIE_UNSAVED_EVENT);
      } else {
        await saveMovie(userId, movie);
        setSaved(true);
        onSaveStatusChange?.(true);
        // Emit save event
        movieSaveEvents.emit(MOVIE_SAVED_EVENT);
      }
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSave}
      disabled={loading}
      className={`bg-dark-100/80 rounded-full p-2 ${
        loading ? "opacity-50" : ""
      }`}
    >
      <Image
        source={icons.save}
        style={{ width: size, height: size }}
        tintColor={saved ? "#caff3f" : "#ffffff"}
      />
    </TouchableOpacity>
  );
};
```

### Props

- `movie`: MovieDetails object
- `userId`: User ID for saving preferences
- `size`: Optional icon size
- `onSaveStatusChange`: Optional callback when save status changes

## 4. TrendingCard Component

### Purpose

Displays trending movies with emphasis on their popularity rank.

### Usage

```tsx
<TrendingCard movie={trendingMovie} index={0} />
```

### Implementation

```tsx
// Based on the project structure, actual implementation may vary
const TrendingCard = ({ movie, index }: TrendingCardProps) => (
  <TouchableOpacity
    className="flex-row items-center bg-dark-100/50 rounded-xl overflow-hidden mr-4 pr-4"
    onPress={() => router.push(`/movie/${movie.movie_id}`)}
  >
    <View className="flex items-center justify-center w-12 h-12 bg-accent mr-3">
      <Text className="text-dark-100 font-bold text-lg">#{index + 1}</Text>
    </View>
    <Image
      source={{ uri: movie.poster_url }}
      className="h-16 w-12 rounded mr-3"
      resizeMode="cover"
    />
    <View className="flex-1">
      <Text className="text-light-100 font-bold text-base">{movie.title}</Text>
      <Text className="text-accent text-sm">{movie.count} searches</Text>
    </View>
  </TouchableOpacity>
);
```

### Props

- `movie`: TrendingMovie object
- `index`: Numerical index/rank of the trending movie

## 5. Screen Components

### Home Screen

Main landing screen that displays popular and trending movies.

### Search Screen

Screen for searching movies by title and viewing search results.

### Saved Screen

Screen displaying the user's saved movie collection.

### Movie Details Screen

Screen showing detailed information about a specific movie.

## 6. Component Hierarchy

```
App
├── TabNavigator
│   ├── HomeScreen
│   │   ├── TrendingCard(s)
│   │   └── MovieCard(s)
│   ├── SearchScreen
│   │   ├── SearchBar
│   │   └── MovieCard(s)
│   ├── SavedScreen
│   │   └── MovieCard(s)
│   └── ProfileScreen
└── MovieDetailScreen
    └── SaveButton
```

## 7. Component Styling

The application uses NativeWind (Tailwind CSS for React Native) for styling components, with consistent classes for:

- Color scheme
- Typography
- Spacing
- Layout
- Rounded corners
- Shadows

### Color Palette

- Primary: Dark backgrounds (#151312)
- Secondary: Accent color (#caff3f)
- Dark shades: #151312, #1A1C20, etc.
- Light shades: #FFFFFF, #A8B5DB, etc.

## 8. Component Reusability

Components are designed to be reusable across the application:

- `MovieCard`: Used in Home, Search, and Saved screens
- `SearchBar`: Used in Search screen
- `SaveButton`: Used in Movie Details screen
- `TrendingCard`: Used in Home screen
