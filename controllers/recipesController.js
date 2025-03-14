exports.getRecipes = async (req, res) => {
    res.render('recipes/recipes.ejs', { errors: [] });
}