exports.getRecipes = async (req, res) => {
    res.render('recipe/recipes.ejs', { errors: [] });
}