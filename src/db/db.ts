import mongoose from 'mongoose'
import config from '../config/config'

const connect = () => mongoose.connect(config.db.URI)

export default connect
