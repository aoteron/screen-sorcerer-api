import dotenv from 'dotenv';

type TConfig = {
    [key:string]: EnvironmentConfig
}

type EnvironmentConfig = {
    app: AppConfig
}

type AppConfig = {
    PORT: string | number
}

// Load environment variables based on NODE_ENV
if(process.env.NODE_ENV === 'production') {
    dotenv.config({path: '.env.production'})
} else {
    dotenv.config({path: '.env.development'})
}

// Determine environment (default to 'development')
const ENV = process.env.NODE_ENV ?? 'development'

// Define configuration based on environment
const CONFIG: TConfig = {
    development:{
        app:{
          PORT: process.env.PORT || 4001  
        }
    },
    production:{
        app:{
            PORT: process.env.PORT || 8888
        }
    }
}

// Export configuration based on environment
export default CONFIG[ENV]