import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";

import { appEvents, SEARCH_PERFORMED } from "@/services/eventEmitter";
import { useCallback, useEffect, useRef } from "react";

export default function Index() {
  const router = useRouter();
  const lastRefreshTime = useRef(0);
  const refreshCooldown = 2000; // 2 seconds cooldown between refreshes

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useFetch(getTrendingMovies);

  // Safe refresh function with cooldown
  const safeRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshTime.current > refreshCooldown) {
      console.log("Refreshing trending movies...");
      lastRefreshTime.current = now;
      refetchTrending();
    } else {
      console.log("Skipping refresh (cooldown active)");
    }
  }, [refetchTrending]);

  // Listen for search events
  useEffect(() => {
    const handleSearchPerformed = (query: string) => {
      console.log(`Search performed: ${query} - refreshing trending`);
      safeRefresh();
    };

    appEvents.on(SEARCH_PERFORMED, handleSearchPerformed);

    return () => {
      appEvents.off(SEARCH_PERFORMED, handleSearchPerformed);
    };
  }, [safeRefresh]);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message} </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for movies"
            />

            {trendingMovies && (
              <View className="mt-5">
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Trending Movies
                </Text>
              </View>
            )}

            <>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                className="mb-4 mt-3"
                data={trendingMovies}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.movie_id.toString()}
              />

              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
