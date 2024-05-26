import express from 'express'
import userRouter from './routes/user.routes'
import movieRoutes from './routes/movie.routes'
import genreRoutes from './routes/genre.routes'
import cors from 'cors'
import cloudinary from './config/cloudinaryConfig'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/user', userRouter)
app.use('/movie', movieRoutes)
app.use('/genre', genreRoutes)

export default app
