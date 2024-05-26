import { Router } from 'express'
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from '../controllers/movie.controllers'

const movieRoutes = Router()

movieRoutes.get('/', getAllMovies)
movieRoutes.post('/create', createMovie)
movieRoutes.patch('/:movieId', updateMovie)
movieRoutes.delete('/:movieId', deleteMovie)

export default movieRoutes
