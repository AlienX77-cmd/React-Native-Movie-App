import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  MOVIE_SAVED_EVENT,
  MOVIE_UNSAVED_EVENT,
  movieSaveEvents,
} from "@/services/eventEmitter";
import { getSavedMovies } from "@/services/savedMovies";
import useFetch from "@/services/useFetch";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Saved = () => {
  const userId = 1;

  const {
    data: savedMovies,
    loading,
    error,
    refetch,
  } = useFetch(() => getSavedMovies(userId));

  // Listen for save/unsave events from anywhere in the app
  useEffect(() => {
    const handleMovieSaved = () => {
      console.log("Movie saved event received");
      refetch();
    };

    const handleMovieUnsaved = () => {
      console.log("Movie unsaved event received");
      refetch();
    };

    // Add event listeners
    movieSaveEvents.on(MOVIE_SAVED_EVENT, handleMovieSaved);
    movieSaveEvents.on(MOVIE_UNSAVED_EVENT, handleMovieUnsaved);

    // Clean up event listeners
    return () => {
      movieSaveEvents.off(MOVIE_SAVED_EVENT, handleMovieSaved);
      movieSaveEvents.off(MOVIE_UNSAVED_EVENT, handleMovieUnsaved);
    };
  }, [refetch]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <View className="w-full flex-row justify-center mt-20 items-center mb-5">
        <Image source={icons.logo} className="w-12 h-10" />
      </View>

      <Text className="text-white text-xl font-bold px-5 mb-4">
        Saved Movies
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#AB8BFF" className="mt-10" />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-red-500">Error loading saved movies</Text>
          <Text className="text-gray-400 mt-2">{error.message}</Text>
        </View>
      ) : savedMovies && savedMovies.length > 0 ? (
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 16,
            marginVertical: 16,
          }}
          className="px-5"
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-10">
          <Image source={icons.save} className="size-16" tintColor="#AB8BFF" />
          <Text className="text-white text-lg font-semibold mt-4">
            No saved movies yet
          </Text>
          <Text className="text-light-200 text-center mt-2">
            Movies you save will appear here. Explore and find movies you would
            like to watch later!
          </Text>
        </View>
      )}
    </View>
  );
};

export default Saved;
