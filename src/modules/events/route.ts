import { Hono } from "hono";
import { prisma } from "../../utils/prisma.js";
import { HTTPException } from "hono/http-exception";
import { notFoundResponse } from "../../utils/errorException.js";
import { createEventValidation, updateEventValidation } from "./validation.js";
import { zValidator } from "@hono/zod-validator";

export const eventsRoute = new Hono()
  .get("/", async (c) => {
    const events = await prisma.event.findMany();
    return c.json({ events });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const event = await prisma.event.findFirst({
      where: {
        id: id,
      },
      include: {
        participants: true,
      },
    });

    return c.json({ event });
  })
  .post("/", zValidator("json", createEventValidation), async (c) => {
    const body = c.req.valid("json");
    const newEvent = await prisma.event.create({
      data: body,
    });
    return c.json({ event: newEvent }, 201);
  })
  .patch("/:id", zValidator("json", updateEventValidation), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) throw new HTTPException(404, { res: notFoundResponse });
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: body,
    });
    return c.json({ updatedEvent });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) throw new HTTPException(404, { res: notFoundResponse });
    await prisma.event.delete({ where: { id } });
    return c.json({message: "Event deleted successfully"})
  });
