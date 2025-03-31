import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	user: { isSubscribed: boolean } | null; // Add user property

	checkAdminStatus: () => Promise<void>;
	fetchUser: () => Promise<void>; // Add fetchUser method
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,
	user: null, // Initialize user as null

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/check");
			set({ isAdmin: response.data.admin });
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchUser: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/api/users/me");
			set({ user: response.data });
		} catch (error: any) {
			set({ user: null, error: error.response?.data?.message || "Failed to fetch user" });
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null, user: null });
	},
}));
