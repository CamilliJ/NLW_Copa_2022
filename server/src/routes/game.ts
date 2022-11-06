import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function gameRouts(fastify : FastifyInstance){
    // criando rota para a listagem de jogos de um bolão
    fastify.get('/pools/:id/games', 
    {onRequest: [authenticate]},
    async (request) => {

        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(request.params)

        const games = await prisma.game.findMany({
            orderBy:{
                date: 'desc',
            },
            include:{
                guesses:{
                    where:{
                        participaint:{
                            userId: request.user.sub,
                            poolId: id,
                        }
                    }
                }
            }
        })

        return {
            games: games.map(game =>{
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined
                }
            })
        }
    })
}