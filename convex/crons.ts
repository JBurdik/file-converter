import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Cleanup old conversions every hour
// Deletes conversions older than 24 hours along with their storage files
crons.interval(
  "cleanup old conversions",
  { hours: 1 },
  internal.conversions.cleanupOldConversions
);

export default crons;
