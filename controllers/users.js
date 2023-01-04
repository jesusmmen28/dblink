const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');

const anonymousUsers = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Esto debería ser sustituido por joi
    if (!name || !email || !password) {
      throw generateError(
        'Debes enviar un nombre, un email y una password',
        400
      );
    }
    const id = await createUser(name, email, password);
console.log(id);
    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getAnonymousUsersController = async (req, res, next) => {
    try {
        const { id } = req.params;
    
        const user = await getUserById(id);
    
        res.send({
          status: 'ok',
          data: user,
        });
      } catch (error) {
        next(error);
      }
};

const loginController = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        throw generateError('Debes enviar un email y una password', 400);
      }
  
      // Recojo los datos de la base de datos del usuario con ese mail
      const user = await getUserByEmail(email);
    
  
      // Compruebo que las contraseñas coinciden
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        throw generateError('La contraseña no es válida', 401);
      }
  
      // Creo el payload del token
      const payload = { id: user.id };
  
      // Firmo el token, con 30 días de expiración
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: '30d',
      });
  
      // Envío el token
      res.send({
        status: 'ok',
        data: token,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
};
