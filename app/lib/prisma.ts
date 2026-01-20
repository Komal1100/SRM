// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "../generated/prisma/client";


// const adapter = new PrismaMariaDb({
//     host : process.env.DB_HOST,
//     user : process.env.DB_USER,
//     password : process.env.DB_PASS,
//     port : Number(process.env.DB_PORT),
//     database : process.env.DB_NAME
// })

// const prisma = new PrismaClient({adapter})

// export {prisma}

import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    port : Number(process.env.DB_PORT),
    database : process.env.DB_NAME
})


const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter : adapter,
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
