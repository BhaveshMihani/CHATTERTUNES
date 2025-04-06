import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SubscriptionPage from "./components/SubscriptionPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import SearchPage from "./pages/search/searchPage";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

declare global {
    interface Window {
        Paddle: any;
    }
}

function App() {
    const { userId } = useAuth();

    useEffect(() => {
        if (window.Paddle) {
            window.Paddle.Environment.set("sandbox");
            window.Paddle.Initialize({
                token: "test_d923dc1fccb7a92542b9409bdbf",
                eventCallback: async (event: any) => {
                    console.log("Paddle event:", event);

                    if (event.name === "checkout.completed") {
                        console.log("Checkout completed successfully!");

                        const subscriptionId = event.data?.subscription_id; // Assuming Paddle sends this
                        const priceId = event.data?.checkout?.items[0]?.price_id; // Example extraction, check your Paddle docs

                        const subscriptionData = {
                            userId, // Clerk User ID
                            subscriptionId, // Subscription ID from Paddle
                            priceId, // Price ID from Paddle
                            status: "active",
                        };

                        try {
                            const response = await axios.post("/api/subscription/webhook", subscriptionData);

                            if (response.status === 201) {
                                console.log("Subscription successfully created:", response.data);
                            } else {
                                console.error("Error creating subscription:", response.data);
                            }
                        } catch (error: any) {
                            console.error("Request failed:", error.response?.data || error.message);
                        }
                    }
                },
            });
        }
    }, [userId]);

    return (
        <>
            <Routes>
                <Route
                    path="/sso-callback"
                    element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
                />
                <Route path="/auth-callback" element={<AuthCallbackPage />} />
                <Route path="/admin" element={<AdminPage />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/albums/:albumId" element={<AlbumPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/subscribe" element={<SubscriptionPage />} />
                </Route>
            </Routes>
            <Toaster toastOptions={{ style: { background: "#333", color: "#fff" } }} />
        </>
    );
}

export default App;