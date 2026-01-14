import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Endpoint to get client IP address (for anonymous rate limiting)
http.route({
  path: "/api/ip",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    // Extract IP from various headers (reverse proxy aware)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");

    // x-forwarded-for can contain multiple IPs, take the first (client IP)
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp ||
      cfConnectingIp ||
      "unknown";

    return new Response(JSON.stringify({ ip }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;
