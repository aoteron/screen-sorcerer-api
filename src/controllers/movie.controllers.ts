import { Request, Response } from 'express'
import prisma from '../db/client'
import mongoose from 'mongoose'
import { renameAndUpdateMovieImage } from '../utils/cloudinaryUtils'

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await prisma.movie.findMany()
    res.status(201).send(allMovies)
  } catch (error) {
    res.status(400).send(`Sorry, there was an error. See more details: ${error}`)
  }
}

export const createMovie = async (req: Request, res: Response) => {
  console.log('Request body:', req.body) //Debugging
  console.log('Request file:', req.file) //Debugging
  console.log('Request params:', req.params) // Debugging

  const { name, score, synopsis, genresIDs } = req.body
  const userId = req.params.userId

  if (!name || !req.file || !score) {
    return res.status(400).send(`Sorry, missing fields. Please add a name, image and score`)
  }

  if (!userId) {
    console.log('Invalid userId')
    return res.status(400).send(`Sorry, user was not found`)
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid userId')
  }

  try {
    const genrePromises = genresIDs.map(async (genreName: string) => {
      let genre = await prisma.genre.findFirst({ where: { name: genreName } })
      if (!genre) {
        genre = await prisma.genre.create({ data: { name: genreName } })
      }
      return { id: genre.id }
    })

    const genres = await Promise.all(genrePromises)

    const newMovie = await prisma.movie.create({
      data: {
        name,
        image: req.file.path,
        score: parseFloat(score),
        synopsis,
        genres: {
          connect: genres,
        },
        user: { connect: { id: userId } },
      },
    })

    try {
      const uploadedMovie = await renameAndUpdateMovieImage(newMovie.id, req.file.filename);
      res.status(201).send(uploadedMovie);
    } catch (error) {
      res.status(500).send(error);
    }
    
  } catch (error) {
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
