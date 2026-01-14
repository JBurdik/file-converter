import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;

const convexClient = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!convexClient) {
    // Return children without Convex if URL is not configured
    return <>{children}</>;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
