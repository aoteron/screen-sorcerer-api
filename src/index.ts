import app from './server'
import config from './config/config'
import connect from './db/db'
import { checkExpiredTokens } from './services/tokenManager'

const PORT = config.app.PORT

connect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} and is connected to db`))
})

setInterval(checkExpiredTokens, 60000)
