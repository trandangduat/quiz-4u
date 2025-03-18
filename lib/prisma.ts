import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
    var prisma: PrismaClient;
}

const prisma: PrismaClient = global.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
}

export default prisma;