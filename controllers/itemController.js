//imports
const Item = require('../models/Item');

// Affiche la liste des items
exports.getItems = async (req, res) => {
  try {
    const allItems = await Item.find({});

    // Filtrer pour ne garder qu'un item par nom
    const uniqueItems = allItems.reduce((acc, item) => {
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
};

// Afficher le formulaire d'ajout d'un nouvel item
exports.getNewItem = (req, res) => {
  res.render('item/newItem.ejs');
};

// Créer un nouvel item
exports.createItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name) {
      return res.status(400).send("Le nom est requis");
    }
    const newItem = new Item({ name, quantity: quantity || 1 });
    await newItem.save();
    res.redirect('/items');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Serveur");
  }
};

// Afficher le formulaire de modification d'un item
exports.getEditItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).send("Item non trouvé");
    }
    res.render('item/editItem.ejs', { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Serveur");
  }
};

// Mettre à jour un item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(id, { name, quantity }, { new: true });
    if (!updatedItem) {
      return res.status(404).send("Item non trouvé");
    }
    res.redirect('/items');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Serveur");
  }
};

// Supprimer un item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/items');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Serveur");
  }
};