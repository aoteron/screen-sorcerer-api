import { Router } from 'express'
import { createGenre, deleteGenre, getAllGenres, updateGenre } from '../controllers/genre.controllers'

const genreRoutes = Router()

genreRoutes.get('/', getAllGenres)
genreRoutes.post('/:userId', createGenre)
genreRoutes.patch('/:genreId', updateGenre)
genreRoutes.delete('/:genreId', deleteGenre)

export default genreRoutes
