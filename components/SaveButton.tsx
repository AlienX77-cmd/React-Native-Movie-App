import {
  movieSaveEvents,
  MOVIE_SAVED_EVENT,
  MOVIE_UNSAVED_EVENT,
} from "@/services/eventEmitter";

import { icons } from "@/constants/icons";
import { isMovieSaved, saveMovie, unsaveMovie } from "@/services/savedMovies";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";

interface SaveButtonProps {
  movie: MovieDetails;
  userId: number;
  size?: number;
  onSaveStatusChange?: (isSaved: boolean) => void;
}

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

export default SaveButton;
