import { Hono } from "hono";
import { prisma } from "../../utils/prisma.js";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { notFoundResponse } from "../../utils/errorException.js";
import { createParticipantSchema, updateParticipantSchema } from "./validation.js";

export const participantsRoute = new Hono()
  .get("/", async (c) => {
    const participants = await prisma.participant.findMany();
    return c.json({ participants });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const participant = await prisma.participant.findUnique({
      where: {
        id,
      },
    })
    return c.json({ participant })
  })
  .post("/", zValidator("json", createParticipantSchema), async (c) => {
    const body = c.req.valid("json");
    const newParticipant = await prisma.participant.create({ data: body })
    return c.json({ event: newParticipant }, 201);
  })
  .patch("/:id", zValidator("json", updateParticipantSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const participant = await prisma.participant.findUnique({ where: { id } })
    if (!participant) throw new HTTPException(404, { res: notFoundResponse })
    console.log(body);
    console.log("content-type:", c.req.header("content-type"));
    console.log("raw json:", await c.req.json().catch(() => "not json"));

    const updatedParticipant = await prisma.participant.update({ where: { id }, data: body })

    return c.json({ updatedParticipant })
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const participant = await prisma.participant.findUnique({ where: { id } })
    if (!participant) throw new HTTPException(404, { res: notFoundResponse })
    await prisma.participant.delete({ where: { id } })
    return c.body(null, 204)
  })
