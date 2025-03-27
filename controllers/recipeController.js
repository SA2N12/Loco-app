const Recipe = require('../models/Recipe');

// create
exports.createRecipe = async (req, res) => {
    let recipes = await Recipe.find();

    // Créer une nouvelle recette
    let newRecipe = new Recipe({ name: req.body.recipeName, description: req.body.recipeDescription,  });
    await newRecipe.save();

    res.redirect('/recettes');
}

//read
exports.getRecipes = async (req, res) => {
    let recipes = await Recipe.find();
    
    res.render('recipe/recipes.ejs', { recipes });
}

exports.getRecipeDetails = async (req, res) => {
    let recipe = await Recipe.findById(req.params.id);
    
    res.render('recipe/recipeDetails.ejs', { recipe });
}

//update
exports.updateRecipe = async (req, res) => {
    let recipe = await Recipe.findById(req.params.id);

    recipe.name = req.body.recipeName;
    recipe.description = req.body.recipeDescription;
    await recipe.save();

    res.redirect('/recettes');
}

//delete
exports.deleteRecipe = async (req, res) => {
    let recipes = await Recipe.find();
    await Recipe.findByIdAndDelete(req.params.id);

    res.redirect('/recettes');
}