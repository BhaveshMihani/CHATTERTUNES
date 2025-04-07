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
import { SubscriptionProvider } from "./context/SubscriptionContext"; // Import the new context
import AllSongsPage from "./pages/all-songs/AllSongsPage";

declare global {
    interface Window {
        Paddle: any;
    }
}

function App() {

    useEffect(() => {
        if (window.Paddle) {
            window.Paddle.Environment.set("sandbox");
            window.Paddle.Initialize({
                token: "test_d923dc1fccb7a92542b9409bdbf",
            });
        }
    }, []);

    return (
        <SubscriptionProvider> {/* Wrap the app with SubscriptionProvider */}
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
                        <Route path="/all-songs" element={<AllSongsPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route path="/subscribe" element={<SubscriptionPage />} />
                    </Route>
                </Routes>
                <Toaster toastOptions={{ style: { background: "#333", color: "#fff" } }} />
            </>
        </SubscriptionProvider>
    );
}

export default App;