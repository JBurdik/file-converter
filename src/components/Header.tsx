import { Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { LucideLogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";
import Logo from "./Logo";

export default function Header() {
  const { data } = authClient.useSession();

  const handleSignOut = () => {
    authClient.signOut();
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-2">
        <Logo size="md" />
      </Link>

      <Unauthenticated>
        <div className="flex items-center gap-3">
          <LoginModal />
          <SignupModal />
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="flex flex-row items-center gap-1">
          <span className="flex items-center gap-1">
            <img
              alt="User avatar"
              src={data?.user?.image ?? ""}
              className="size-7 rounded"
            />
            <p>{data?.user?.name ?? ""}</p>
          </span>
          <Button
            variant="ghost"
            className="text-destructive"
            size="icon"
            onClick={handleSignOut}
          >
            <LucideLogOut className="w-4 h-4" />
          </Button>
        </div>
      </Authenticated>
      <AuthLoading>Loading...</AuthLoading>
    </header>
  );
}
