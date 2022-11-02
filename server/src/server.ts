import Fastify from "fastify";
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors'
import {z} from 'zod'

import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap(){
    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true
    })

    // criando a rota para a Contagem de Bolões
    fastify.get('/pools/cont', async () => {

        const count =  await prisma.pool.count()
        return {count}
    })

    // criando a rota para a Contagem de Usuarios
    fastify.get('/users/cont', async () => {

        const count =  await prisma.user.count()
        return {count}
    })

     // criando a rota para a Contagem de Palpites
     fastify.get('/guesses/cont', async () => {

        const count =  await prisma.guess.count()
        return {count}
    })

    // criando a rota para a Criação de um Bolão
    fastify.post('/pools', async (request, reply) => {

        const createPollBody = z.object({
            title: z.string(),
        })

        const {title} = createPollBody.parse(request.body)
        const generate = new ShortUniqueId({length: 6})
        const code = String(generate()).toUpperCase()

        await prisma.pool.create({
            data:{
                title,
                code,
            }
        })

        return reply.status(201).send({code})
    })

    await fastify.listen({port: 3333, /* host: '0.0.0.0' */})
}

bootstrap()