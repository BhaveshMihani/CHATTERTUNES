import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  albums: Album[];
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  featuredSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  searchResults: Song[];

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYou: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
  fetchSearchResults: (query: string) => Promise<void>;
  updateSong: (id: string, data: FormData) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  searchResults: [],
  stats: {
    totalAlbums: 0,
    totalSongs: 0,
    totalArtists: 0,
    totalUsers: 0,
  },

  deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYou: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSearchResults: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/search?query=${query}`);
      console.log("Fetched search results:", response.data); // Add this log
      set({ searchResults: Array.isArray(response.data.results) ? response.data.results : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response.data.Message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSong: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/songs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        songs: state.songs.map((song) => (song._id === id ? response.data : song)),
      }));
      toast.success("Song updated successfully");
    } catch (error: any) {
      console.log("Error in updateSong", error);
      toast.error("Error updating song");
    } finally {
      set({ isLoading: false });
    }
  },
}));