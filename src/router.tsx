import { ConvexQueryClient } from "@convex-dev/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;

// Create the ConvexQueryClient instance
export const convexQueryClient = new ConvexQueryClient(CONVEX_URL ?? "");

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      convexQueryClient,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
