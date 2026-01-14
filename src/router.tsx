import { ConvexQueryClient } from "@convex-dev/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set");
}

// Create the ConvexQueryClient instance
const convexQueryClient = new ConvexQueryClient(convexUrl, {
  expectAuth: true,
});

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
