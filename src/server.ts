import express from 'express'
import userRouter from './routes/user.routes'
import movieRoutes from './routes/movie.routes'
import genreRoutes from './routes/genre.routes'
import cors from 'cors'
import bodyParserMiddleware from './utils/bodyParser'

const app = express()
app.use(cors())
app.use(bodyParserMiddleware)

app.use('/user', userRouter)
app.use('/movie', movieRoutes)
app.use('/genre', genreRoutes)

export default app
