import { Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { FileStack, LucideLogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";

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
          <Button variant="ghost" size="sm" onClick={handleSignIn}>
            Login
          </Button>
          <Button variant="primary" size="sm" onClick={handleSignUp}>
            Sign up
          </Button>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Button variant="danger" size="sm" onClick={handleSignOut}>
          Logout
          <LucideLogOut className="w-4 h-4" />
        </Button>
      </Authenticated>
      <AuthLoading>Loading...</AuthLoading>
    </header>
  );
}
