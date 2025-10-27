import { PrismaClient } from "@prisma/client"

export function createPrismaClient() {
  return new PrismaClient({
    errorFormat: "pretty",
    log: ['error'],
  })
}
