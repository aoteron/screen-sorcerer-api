import dotenv from 'dotenv'

type TConfig = {
  [key: string]: EnvironmentConfig
}

type EnvironmentConfig = {
  app: AppConfig
  db: DbConfig
}

type AppConfig = {
  PORT: string | number
}

type DbConfig = {
  URI: string
}

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' })
} else {
  dotenv.config({ path: '.env.development' })
}

const ENV = process.env.NODE_ENV ?? 'development'

const CONFIG: TConfig = {
  development: {
    app: {
      PORT: process.env.PORT || 4004,
    },
    db: {
      URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    },
  },
  production: {
    app: {
      PORT: process.env.PORT || 8008,
    },
    db: {
      URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    },
  },
}

export default CONFIG[ENV]
