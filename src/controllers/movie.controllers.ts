import { Request, Response } from 'express'
import prisma from '../db/client'
import mongoose from 'mongoose'
import { renameAndUpdateMovieImage } from '../utils/cloudinaryUtils'

interface RequiredFields {
  name: string
  score: string
  synopsis: string
  genre: string
  image: string
  userId: string
}

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await prisma.movie.findMany()
    res.status(201).send(allMovies)
  } catch (error) {
    res.status(400).send(`Sorry, there was an error. See more details: ${error}`)
  }
}

export const createMovie = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body) // Debugging
    console.log('Request params:', req.params) // Debugging

    const { name, score, synopsis, image, genre, userId } = req.body

    const requiredFields: RequiredFields = { name, score, synopsis, genre, image, userId }
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !requiredFields[field as keyof RequiredFields],
    )

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return res.status(400).send(`Sorry, missing fields: ${missingFields.join(', ')}`)
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid userId')
    }

    const genreData =
      (await prisma.genre.findFirst({
        where: { name: genre },
      })) ||
      (await prisma.genre.create({
        data: { name: genre },
      }))

    const newMovie = await prisma.movie.create({
      data: {
        name,
        image,
        score: parseFloat(score),
        synopsis,
        genres: {
          connect: { id: genreData.id },
        },
        user: {
          connect: { id: userId },
        },
      },
    })

    res.status(201).send(newMovie)
  } catch (error) {
    console.error('Error creating movie:', error)
    res.status(400).send(`There was an error creating the movie. See more details: ${error}`)
  }
}

export const updateMovie = async (req: Request, res: Response) => {
  const { name, image, score, synopsis, newGenres, deleteGenres } = req.body
  const { movieId } = req.params

  if (!name && !image && !score && synopsis && newGenres && deleteGenres) {
    return res.status(400).send(`Any change provided`)
  }

  try {
    const movieUpdated = await prisma.movie.update({
      where: { id: movieId },
      data: {
        name,
        image,
        score,
        synopsis,
        genres: {
          connect: newGenres?.map((genreId: string) => ({ id: genreId })),
          disconnect: deleteGenres?.map((genreId: string) => ({ id: genreId })),
        },
      },
      include: {
        genres: true,
      },
    })

    res.status(200).send(movieUpdated)
  } catch (error) {
    res.status(500).send(`Sorry, there was an error. See more details: ${error}`)
  }
}

export const deleteMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: { genres: true },
  })

  if (!movie) {
    return res.status(404).send('Movie not found')
  }

  try {
    const moviesInGenre = await prisma.genre.findMany({
      where: {
        movies: {
          some: {
            id: movieId,
          },
        },
      },
    })

    await Promise.all(
      moviesInGenre.map(async (genre) => {
        await prisma.genre.update({
          where: { id: genre.id },
          data: {
            movies: {
              disconnect: {
                id: movieId,
              },
            },
          },
        })
      }),
    )

    await prisma.movie.delete({ where: { id: movieId } })

    res.status(200).send(`Movie successfully deleted`)
  } catch (error) {
    res.status(400).send(`Sorry, there was an error. See more details: ${error}`)
  }
}
