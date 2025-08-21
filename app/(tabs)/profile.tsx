import {
  MOVIE_SAVED_EVENT,
  MOVIE_UNSAVED_EVENT,
  movieSaveEvents,
} from "@/services/eventEmitter";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMoviesCount } from "@/services/savedMovies";
import useFetch from "@/services/useFetch";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

// Profile detail item component
const ProfileDetail = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-4">
    <Text className="text-gray-400 text-sm mb-1">{label}</Text>
    <Text className="text-white text-base">{value}</Text>
  </View>
);

const Profile = () => {
  // User ID should match what you use elsewhere in the app
  const userId = 1;

  const {
    data: savedCount,
    loading: countLoading,
    refetch: refreshCount,
  } = useFetch(() => getSavedMoviesCount(userId));

  // Listen for movie save/unsave events to update the count
  useEffect(() => {
    const updateCount = () => {
      refreshCount();
    };

    // Add event listeners
    movieSaveEvents.addListener(MOVIE_SAVED_EVENT, updateCount);
    movieSaveEvents.addListener(MOVIE_UNSAVED_EVENT, updateCount);

    return () => {
      // Clean up event listeners
      movieSaveEvents.removeListener(MOVIE_SAVED_EVENT, updateCount);
      movieSaveEvents.removeListener(MOVIE_UNSAVED_EVENT, updateCount);
    };
  }, [refreshCount]);

  // Mock user data - replace with actual user data
  const userProfile = {
    fullName: "Kittipak Wibulsthien",
    age: "23",
    gender: "Male",
    summary:
      "Movie enthusiast with a passion for sci-fi and action films. Enjoys exploring new genres and international cinema.",
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full h-full z-0"
        resizeMode="cover"
      />
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-accent/80 items-center justify-center mb-3">
            <Image source={icons.person} className="size-10" tintColor="#fff" />
          </View>
        </View>

        {/* Profile Information Card */}
        <View className="bg-dark-100/70 rounded-xl p-5 mb-6">
          <Text className="text-white text-xl font-bold mb-4">
            Personal Information
          </Text>

          <ProfileDetail label="Full Name" value={userProfile.fullName} />
          <ProfileDetail label="Age" value={userProfile.age} />
          <ProfileDetail label="Gender" value={userProfile.gender} />
        </View>

        {/* Profile Summary Card */}
        <View className="bg-dark-100/70 rounded-xl p-5 mb-8">
          <Text className="text-white text-xl font-bold mb-4">About Me</Text>
          <Text className="text-white text-base leading-6">
            {userProfile.summary}
          </Text>
        </View>

        {/* Movie Stats Card */}
        <View className="bg-dark-100/70 rounded-xl p-5 mb-6">
          <Text className="text-white text-xl font-bold mb-4">Movie Stats</Text>

          <View className="items-start">
            {countLoading ? (
              <ActivityIndicator color="#AB8BFF" size="small" />
            ) : (
              <>
                <Text className="text-accent text-2xl font-bold">
                  {savedCount || 0}
                </Text>
                <Text className="text-gray-400">Saved</Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
