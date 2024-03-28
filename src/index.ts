import app from './server';
import config from './config/config';

const PORT = config.app.PORT

// Starting the server to listen for incoming HTTP requests on port 4000.
app.listen(PORT, () => console.log('Server listening on port ' + PORT))