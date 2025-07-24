import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/admin/teams/spend": {
      async GET(req) {
        const url = new URL(req.url);
        const start = url.searchParams.get("start");
        const end = url.searchParams.get("end");
        const granularity = url.searchParams.get("granularity") ?? "day"; // hour|day|week|month

        if (!start || !end) {
          return new Response(
            JSON.stringify({ error: "Missing required query parameters 'start' and 'end'." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return new Response(
            JSON.stringify({ error: "Invalid date format for 'start' or 'end'." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        // Utility to advance the cursor based on granularity
        const advanceCursor = (date: Date): Date => {
          const next = new Date(date);
          switch (granularity) {
            case "hour":
              next.setHours(next.getHours() + 1);
              break;
            case "week":
              next.setDate(next.getDate() + 7);
              break;
            case "month":
              next.setMonth(next.getMonth() + 1);
              break;
            case "day":
            default:
              next.setDate(next.getDate() + 1);
          }
          return next;
        };

        const buckets: { periodStart: string; spend: number }[] = [];
        let cursor = new Date(startDate);
        while (cursor <= endDate) {
          const spend = parseFloat((Math.random() * 1000).toFixed(2)); // Dummy data
          buckets.push({ periodStart: cursor.toISOString(), spend });
          cursor = advanceCursor(cursor);
        }

        return Response.json({ start, end, granularity, data: buckets });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
