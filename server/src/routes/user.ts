import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

export async function userRouts(fastify: FastifyInstance) {
    // criando a rota para a Contagem de Usuarios
    fastify.get('/users/cont', async () => {

        const count = await prisma.user.count()
        return { count }
    })
}