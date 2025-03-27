//imports
const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const listController = require('./controllers/listController');
const stockController = require('./controllers/stockController');
const recipeController = require('./controllers/recipeController');
const itemController = require('./controllers/itemController');

//index
router.get('/', indexController.getIndex);

//lists
router.post('/listes', listController.createList);
router.get('/listes', listController.getLists);
router.get('/listes/:id', listController.getList);
router.put('/listes/:id', listController.updateList);
router.delete('/listes/:id', listController.deleteList);
router.post('/listes/:id/item', listController.addNewItemToList);
router.delete('/listes/:id/item/:itemId', listController.deleteItemFromList);
router.post('/listes/:id/recette', listController.addRecipeToList);

//stocks
router.post('/stocks', stockController.createStock);
router.get('/stocks', stockController.getStocks);
router.get('/stocks/:id', stockController.getStock);
router.put('/stocks/:id', stockController.updateStock);
router.delete('/stocks/:id', stockController.deleteStock);

//recipes
router.post('/recettes', recipeController.createRecipe);
router.get('/recettes', recipeController.getRecipes);
router.put('/recettes/detail/:id', recipeController.updateRecipe);
router.delete('/recettes/detail/:id', recipeController.deleteRecipe);
router.post('/recettes/detail/:id/item', recipeController.createRecipeItem);
router.get('/recettes/detail/:id', recipeController.getRecipeDetails);
router.delete('/recettes/detail/:id/item/:itemId', recipeController.deleteRecipeItem);

//items
router.post('/items', itemController.createItem);
router.get('/items', itemController.getItems);
router.get('/items/new', itemController.getNewItem);
router.get('/items/:id/edit', itemController.getEditItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

//export
module.exports = router;