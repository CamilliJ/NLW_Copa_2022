import Fastify from "fastify";
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { poolRouts } from "./routes/pool";
import { authRouts } from "./routes/auth";
import { gameRouts } from "./routes/game";
import { gueesRouts } from "./routes/guesses";
import { userRouts } from "./routes/user";



async function bootstrap(){
    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true
    })

    await fastify.register(jwt,{
        secret: 'nlwcopa',

    })

    await fastify.register(poolRouts)
    await fastify.register(authRouts)
    await fastify.register(gameRouts)
    await fastify.register(gueesRouts)
    await fastify.register(userRouts)


    await fastify.listen({port: 3333, host: '0.0.0.0' })
}

bootstrap()