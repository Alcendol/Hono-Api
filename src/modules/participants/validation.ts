import z from "zod";

export const createParticipantSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  eventId: z.string(),
})
export const updateParticipantSchema = createParticipantSchema.omit({eventId:true}).partial();
