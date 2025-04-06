import { useEffect, useState } from "react";
import { CheckCircle, CreditCard, LayoutDashboardIcon, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore"; // Import the store
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { SignedOut, SignInButton, useAuth, UserButton } from "@clerk/clerk-react";

const Topbar = () => {
    const { isAdmin } = useAuthStore();
    const { fetchSubscriptionStatus } = useChatStore(); // Fetch the function
    const [isSubscribed, setIsSubscribed] = useState(false);

    const { userId } = useAuth(); 

    useEffect(() => {
        const checkSubscription = async () => {
            if (userId) {
                console.log("Fetching subscription status for user:", userId); // Debug log
                const status = await fetchSubscriptionStatus(userId);
                console.log("Subscription status fetched:", status); // Debug log
                setIsSubscribed(status);
            }
        };

        checkSubscription();
    }, [userId, fetchSubscriptionStatus]);

    return (
        <div
            className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
            backdrop-blur-md z-10"
        >
            {/* Logo Section */}
            <div className="flex gap-2 items-center">
                <Link to={"/"}>
                    <img src="/headphone1.png" className="size-12" alt="Spotify logo" />
                </Link>
                <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    CHATTERTUNES
                </p>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
                {/* Admin Dashboard Button (Visible only if Admin) */}
                {isAdmin && (
                    <Link
                        to={"/admin"}
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        <LayoutDashboardIcon className="size-4 mr-2" />
                        Admin Dashboard
                    </Link>
                )}
                
                {isSubscribed ? (
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle />
                        <span>Subscribed</span>
                    </div>
                ) : (
                    <Link
                        to={"/subscribe"}
                        className={cn(buttonVariants({ variant: "outline" }))}
                        onClick={() => console.log("Subscribe button clicked")} // Debug log
                    >
                        <CreditCard />
                        Subscribe
                    </Link>
                )}

                {/* Login Button (Only if User is Signed Out) */}
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant={"outline"} size="default">
                            <LogIn />
                            Login
                        </Button>
                    </SignInButton>
                </SignedOut>

                {/* User Profile Button */}
                <UserButton />
            </div>
        </div>
    );
};

export default Topbar;