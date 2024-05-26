import { Router } from 'express'
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from '../controllers/movie.controllers'
import multerUploads from '../utils/multerConfig'

const movieRoutes = Router()

movieRoutes.get('/', getAllMovies)
movieRoutes.post('/:userId', multerUploads.single('image'), createMovie)
movieRoutes.patch('/:movieId', updateMovie)
movieRoutes.delete('/:movieId', deleteMovie)

export default movieRoutes
