const { createLink, getAllLinks, getLinkById, deleteLinkById } = require("../db/links");
const { generateError } = require('../helpers');


// Listar links/get link
const getLinksController = async (req, res, next) => {
  try {
    const links = await getAllLinks();
    res.send({
        status: 'ok',
        data: links,
    });
  } catch (error) {
    next(error);
  }
};

//controlador del new link
const newLinkController = async (req, res, next) => {
   try {
    const { link, titulo, descripcion } = req.body;

    if (!titulo || !descripcion || !link || link.length > 280) {
      throw generateError(
        'El link debe existir y ser menor de 280 caracteres',
        400
      );
    }
    const id = await createLink(req.userId, link, titulo, descripcion);
    res.send({
      status: 'ok',
      message: `Link con id: ${id} creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

// ubicar un link específico según su id
const getSingleLinkController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const link = await getLinkById(id);
  
      res.send({
        status: 'ok',
        data: link,
      });
    } catch (error) {
      next(error);
    }
  };

  const deleteLinkController = async (req, res, next) => {
    try {
      //req.userId
      const { id } = req.params;
  
      // Conseguir la información del tweet que quiero borrar
      const link = await getLinkById(id);
  
      // Comprobar que el usuario del token es el mismo que creó el tweet
      if (req.userId !== link.user_id) {
        throw generateError(
          'Estás intentando borrar un link que no has creado',
          401
        );
      }
  
      // Borrar el tweet
      await deleteLinkById(id);
  
      res.send({
        status: 'ok',
        message: `El link con id: ${id} fue borrado satisfactoriamente`,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
};
