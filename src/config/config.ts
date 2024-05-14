import dotenv from 'dotenv'

type TConfig = {
  [key: string]: EnvironmentConfig
}

type EnvironmentConfig = {
  app: AppConfig
}

type AppConfig = {
  PORT: string | number
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
  },
  production: {
    app: {
      PORT: process.env.PORT || 8008,
    },
  },
}

export default CONFIG[ENV]
