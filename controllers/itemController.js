//imports
const Item = require('../models/Item');

exports.getItems = async (req, res) => {
    try {
        const allItems = await Item.find({});
    
        // Filtrer pour ne garder qu'un item par nom (vous pouvez adapter le critère si nécessaire)
        const uniqueItems = allItems.reduce((acc, item) => {
          // Vérifier si un item avec le même nom est déjà présent
          if (!acc.some(existingItem => existingItem.name === item.name)) {
            acc.push(item);
          }
          return acc;
        }, []);
    
        res.render('item/items.ejs', { items: uniqueItems });
      } catch (err) {
        console.error(err);
        res.status(500).send("Erreur Serveur");
      }
}