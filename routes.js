//imports
const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const listsController = require('./controllers/listsController');
const stockController = require('./controllers/stockController');
const recipesController = require('./controllers/recipesController');

//index
router.get('/', indexController.getIndex);

//lists
router.get('/listes', listsController.getLists);
router.post('/listes', listsController.addList);
router.get('/listes/:id', listsController.getList);
router.put('/listes/:id', listsController.updateList);
router.delete('/listes/:id', listsController.deleteList);

//stock
router.get('/stock', stockController.getStock);

//recipes
router.get('/recettes', recipesController.getRecipes);

//export
module.exports = router;