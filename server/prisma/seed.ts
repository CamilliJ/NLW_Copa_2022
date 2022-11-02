import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data:{
            name: 'John Doe',
            email: 'jonhdoe@gmail.com',
            avatarURL: 'https://github.com/CamilliJ.png',
        }
    })

    const pool = await prisma.pool.create({
        data:{
            title: 'Exemple Pool',
            code: 'BOL123',
            ownerId: user.id,

            participant: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data:{
            date: '2022-11-02T12:00:00.194Z',
            fistTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'
        }
    })

    await prisma.game.create({
        data:{
            date: '2022-11-05T14:00:00.194Z',
            fistTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses:{
                create:{
                    fistTeamPoint: 2,
                    secondTeamPoint: 1,

                    participaint:{
                        connect:{
                            userId_poolId:{
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()