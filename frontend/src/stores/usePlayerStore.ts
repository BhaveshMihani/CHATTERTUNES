import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  playlist: Song[];
  currentIndex: number;
  repeatMode: "none" | "album" | "song";
  shuffleMode: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleRepeatMode: () => void;
  toggleShuffleMode: () => void;
  setPlaylist: (songs: Song[]) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  playlist: [],
  currentIndex: -1,
  repeatMode: "none",
  shuffleMode: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      playlist: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    const socket = useChatStore.getState().socket;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      playlist: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue, repeatMode, shuffleMode } = get();
    let nextIndex = currentIndex + 1;

    if (repeatMode === "song") {
        const audio = document.querySelector("audio");
        if (audio) {
          audio.currentTime = 0;
          audio.play();
        }
      } 

      else{

          
          if (shuffleMode && queue.length > 1) {
              nextIndex = Math.floor(Math.random() * queue.length);
            }

            if (nextIndex < queue.length) {
                const nextSong = queue[nextIndex];
                const socket = useChatStore.getState().socket;

      if (socket?.auth) {
        socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
    }
    
    set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else if (repeatMode === "album") {
      const firstSong = queue[0];
      const socket = useChatStore.getState().socket;

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
        });
    }

      set({
        currentSong: firstSong,
        currentIndex: 0,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  }},

  playPrevious: () => {
    const { currentIndex, queue, repeatMode } = get();
    const audio = document.querySelector("audio");

    if (audio && audio.currentTime > 5) {
      audio.currentTime = 0;
      audio.play();
      return;
    }

    if (repeatMode === "song") {
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      const prevIndex = currentIndex - 1;

      if (prevIndex >= 0) {
        const prevSong = queue[prevIndex];
        const socket = useChatStore.getState().socket;

        if (socket?.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
          });
        }

        set({
          currentSong: prevSong,
          currentIndex: prevIndex,
          isPlaying: true,
        });
      } else {
        set({ isPlaying: false });
        const socket = useChatStore.getState().socket;

        if (socket?.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: "Idle",
          });
        }
      }
    }
  },

  toggleRepeatMode: () => {
    const { repeatMode } = get();
    set({
      repeatMode:
        repeatMode === "none"
          ? "album"
          : repeatMode === "album"
          ? "song"
          : "none",
    });
  },

  toggleShuffleMode: () => {
    const { shuffleMode, playlist } = get();
    const newShuffleMode = !shuffleMode;
    const shuffledQueue = newShuffleMode
      ? playlist.slice().sort(() => Math.random() - 0.5)
      : playlist;

    set({
      shuffleMode: newShuffleMode,
      queue: shuffledQueue,
    });
  },

  setPlaylist: (songs: Song[]) => {
    set({ playlist: songs });
  },
}));

export default usePlayerStore;