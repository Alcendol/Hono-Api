import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { eventsRoute } from "./modules/events/route.js";
import { participantsRoute } from "./modules/participants/route.js";

const app = new Hono();
app.get("/", (c) =>
  c.json({ message: "Hello, the endpoints are /events and /participants" }),
);
app.route("/events", eventsRoute);
app.route("/participants", participantsRoute);

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
