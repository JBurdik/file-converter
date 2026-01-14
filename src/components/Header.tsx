import { Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { FileStack, LucideLogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const handleSignIn = () => {
    alert("Sign in");
  };
  const handleSignUp = () => {
    alert("Sign in");
  };
  const handleSignOut = () => {
    authClient.signOut();
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-brand-blue-light to-brand-blue flex items-center justify-center">
          <FileStack className="w-5 h-5 text-white" />
        </div>
      </Link>

      <Unauthenticated>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Login
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors"
          >
            Sign up
          </button>
        </div>
      </Unauthenticated>
      <Authenticated>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-500 text-primary transition-colors"
        >
          Logout
          <LucideLogOut />
        </button>
      </Authenticated>
      <AuthLoading>Loading...</AuthLoading>
    </header>
  );
}
