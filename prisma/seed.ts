import { prisma } from "../src/utils/prisma.js"

async function main() {
  const event = await prisma.event.create({
    data: {
      name: "DevScale",
      description: "Fullstack Bootcamp",
      dateTime: "6 Januari 2026",
      location: "Zoom Meeting"
    }
  })
  const alice = await prisma.participant.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
      eventId: event.id,
    },
  })
  const bob = await prisma.participant.create({
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
      eventId: event.id,
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
