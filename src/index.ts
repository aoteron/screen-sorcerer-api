import dotenv from 'dotenv';
dotenv.config()
import './config/cloudinaryConfig'
import app from './server'
import config from './config/config'
import connect from './db/db'
import { checkExpiredTokens } from './services/tokenManager'

console.log('Dotenv Loaded');

const PORT = config.app.PORT

connect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} and is connected to db`))
})

setInterval(checkExpiredTokens, 60000)
