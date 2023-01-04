require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
} = require('./controllers/users');

const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
} = require('./controllers/links');

const { authUser } = require('./middlewares/auth');


const app = express();

app.use(express.json());
app.use(morgan('dev'));

//Rutas de usuario
app.post('/user', anonymousUsers /*newUserController*/);//nos permite registrar
app.get('/user/:id', getAnonymousUsersController /*getUserController*/);//nos da informacion de un usuario
app.post('/login', loginController); //nos permite logearnos
//app.put('/user/:id', authUser, editUser )

//Rutas de link
app.post('/', authUser, newLinkController /*newTweetController*/); //creo los link
app.get('/', getLinksController /*getTweetsController*/); //listo los link
app.get('/link/:id', getSingleLinkController /*getSingleTweetController*/); //Devuelvo un link
app.delete('/link/:id', authUser, deleteLinkController /*deleteTweetController*/); //borro un link


//ruta de votos
//app.post('/link/:id/votes', authUser, existLink, votesLink);
//app.get('/link/:id/votes', existLink, getLinkVotes);




// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

// Lanzamos el servidor
app.listen(4000, () => {
  console.log('Servidor funcionando! 👻');
});
