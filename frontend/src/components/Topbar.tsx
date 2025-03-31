import {
  SignedOut,
  SignedIn, // ✅ Import this
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { CreditCard, LayoutDashboardIcon, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

const Topbar = () => {
  const { isAdmin } = useAuthStore();

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

        {/* Subscription Button (Visible Only if User is Signed In) */}
        <SignedIn>
          <Link
            to={"/subscribe"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <CreditCard />
            Subscribe
          </Link>
        </SignedIn>

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
