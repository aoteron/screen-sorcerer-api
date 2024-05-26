import { Router } from 'express'
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from '../controllers/movie.controllers'
import multerUploads from '../utils/multerConfig'
import bodyParserMiddleware from '../utils/bodyParser'

const movieRoutes = Router()

movieRoutes.use(bodyParserMiddleware)

movieRoutes.get('/', getAllMovies)
movieRoutes.post('/:userId', bodyParserMiddleware, multerUploads.single('image'), createMovie)
movieRoutes.patch('/:movieId', updateMovie)
movieRoutes.delete('/:movieId', deleteMovie)

export default movieRoutes
