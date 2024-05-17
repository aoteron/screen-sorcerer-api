import { Request, Response } from 'express'
import prisma from '../db/client'

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const AllGenres = await prisma.genre.findMany()
    res.status(200).send(AllGenres)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body
  // const createdBy = req.params.userId

  try {
    const newGenre = await prisma.genre.create({
      data: {
        name,
      },
    })
    res.status(200).send(`New genre '${newGenre.name}' successfully created!`)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const updateGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params
  const { name, movies } = req.body

  try {
    await prisma.genre.update({
      where: {
        id: genreId,
      },
      data: {
        name,
      },
    })
    res.status(200).send(`Genre '${name}' successfully updated`)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const deleteGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params
  const genre = await prisma.genre.findUnique({
    where: { id: genreId },
    include: { movies: true },
  })

  if (!genre) {
    return res.status(404).send('Genre was not found')
  }

  try {
    const moviesWithGenre = await prisma.movie.findMany({
      where: {
        genres: {
          some: {
            id: genreId,
          },
        },
      },
    })

    await Promise.all(
      moviesWithGenre.map(async (movie) => {
        await prisma.movie.update({
          where: { id: movie.id },
          data: {
            genres: {
              disconnect: {
                id: genreId,
              },
            },
          },
        })
      }),
    )

    await prisma.genre.delete({ where: { id: genreId } })

    res.status(200).send(`Genre successfully deleted`)
  } catch (error) {
    res.status(400).send(error)
  }
}
