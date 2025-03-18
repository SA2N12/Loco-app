//imports
const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const listsController = require('./controllers/listsController');
const stockController = require('./controllers/stockController');
const recipesController = require('./controllers/recipesController');
const itemController = require('./controllers/itemController');

//index
router.get('/', indexController.getIndex);

//lists
router.get('/listes', listsController.getLists);
router.post('/listes', listsController.createList);
router.get('/listes/:id', listsController.getList);
router.put('/listes/:id', listsController.updateList);
router.delete('/listes/:id', listsController.deleteList);
router.post('/listes/:id/item', listsController.addNewItemToList);
router.delete('/listes/:id/item/:itemId', listsController.deleteItemFromList);

//recipes
router.get('/recettes', recipesController.getRecipes);

//stocks
router.get('/stocks', stockController.getStocks);
router.post('/stocks', stockController.createStock);
router.get('/stocks/:id', stockController.getStock);
router.put('/stocks/:id', stockController.updateStock);
router.delete('/stocks/:id', stockController.deleteStock);

//items
router.get('/items', itemController.getItems);

//export
module.exports = router;