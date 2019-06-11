const app = require('./app.js');
const { PORT } = require('./config');

// Added the port for the server to listen to via the config
// file and app import
app.listen(PORT, () =>{
  console.log(`Server listening on Port: ${PORT}`);
})