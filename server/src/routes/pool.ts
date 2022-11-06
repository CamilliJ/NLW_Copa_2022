import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRouts(fastify : FastifyInstance){

    // criando a rota para a Contagem de Bolões
    fastify.get('/pools/cont', async () => {

        const count =  await prisma.pool.count()
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


        try{
            await request.jwtVerify()

            await prisma.pool.create({
                data:{
                    title,
                    code,
                    ownerId: request.user.sub,

                    participant:{
                        create: {
                            userId: request.user.sub
                        }
                    }
                }
            })
        } catch{
            await prisma.pool.create({
                data:{
                    title,
                    code,
                }
            })
        }

       

        return reply.status(201).send({code})
    })

    // criando a rota para entrar em um Bolão
    fastify.post('/pools/join', 
    {onRequest: [authenticate]},
    async (request, reply) => {

        const joinPollBody = z.object({
            code: z.string(),
        })

        const {code} = joinPollBody.parse(request.body)

        const pool = await prisma.pool.findUnique({
            where:{
                code
            },
            include:{
                participant:{
                    where:{
                        userId: request.user.sub
                    }
                }
            }
        })

        if(!pool){
            return reply.status(400).send({
                message: 'Pool not found.'
            })
        }

        if(pool.participant.length > 0){
            return reply.status(400).send({
                message: 'You alredy joined this pool.'
            })
        }

        if(!pool.ownerId){
            await prisma.pool.update({
                where:{
                    id: pool.id     
                },
                data: {
                    ownerId: request.user.sub
                }
            })
        }

        await prisma.participant.create({
            data:{
                poolId: pool.id,
                userId: request.user.sub
            }
        })

        return reply.status(201).send()

    })

    // criando a rota para a Listagem de Bolões que eu participo
    fastify.get('/pools', 
    {onRequest: [authenticate]},
    async (request) => {

        const pools =  await prisma.pool.findMany({
            where:{
                participant:{
                    some:{
                        userId: request.user.sub
                    }
                }
            },
            include:{
                _count:{
                    select:{
                        participant: true
                    }
                },
                participant:{
                    select:{
                        id: true,

                        user:{
                            select:{
                                avatarURL: true
                            }
                        }
                    },
                    take: 4
                },
                ownew: {
                    select:{
                        name: true,
                        id: true
                    }
                },

            }
        })

        return {pools}
    })

    // criando a rota para a detalhe do Bolão
    fastify.get('/pools/:id', 
    {onRequest: [authenticate]},
    async (request) => {

        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(request.params)

        const pool =  await prisma.pool.findUnique({
            where:{
                id,
            },
            include:{
                _count:{
                    select:{
                        participant: true
                    }
                },
                participant:{
                    select:{
                        id: true,

                        user:{
                            select:{
                                avatarURL: true
                            }
                        }
                    },
                    take: 4
                },
                ownew: {
                    select:{
                        name: true,
                        id: true
                    }
                },

            }
        })

        return {pool}
    })
}