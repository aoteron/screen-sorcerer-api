import app from './server';
import config from './config/config';

console.log(config.app.PORT)
console.log('Funciono')

// Starting the server to listen for incoming HTTP requests on port 4000.
app.listen(4000, () => {
    
})