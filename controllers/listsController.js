const { body, validationResult } = require('express-validator');
const List = require('../models/list');
const Stock = require('../models/Stock');
const Item = require('../models/Item');

exports.getLists = async (req, res) => {
    try {
        const lists = await List.find();
        res.render('list/lists.ejs', { errors: [], lists });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createList = [
    body('listName').notEmpty().withMessage('Le nom de la liste est obligatoire'),
    async (req, res) => {
        const errors = validationResult(req);
        let lists = await List.find();

        // Renvoi une erreur si la liste ne contient pas de nom
        if (!errors.isEmpty()) {
            return res.render('list/lists.ejs', { errors: errors.array(), lists });
        }

        // Vérifier si la liste existe déjà
        let list = lists.find(list => list.name === req.body.listName);
        if (list) {
            errors.errors.push({ msg: 'La liste existe déjà' });
            return res.render('list/lists.ejs', { errors: errors.array(), lists });
        }

        // Créer une nouvelle liste
        let newList = new List({ name: req.body.listName });
        await newList.save();

        // Puis rediriger ou re-rendre la page avec la liste mise à jour
        lists = await List.find();
        res.render('list/lists.ejs', { errors: [], lists });
    }
];

exports.getList = async (req, res) => {
    try {
        const listId = req.params.id;
        const list = await List.findById(listId).populate('items');
        if (!list) {
            return res.status(404).send('Liste introuvable');
        }
        // Récupérer les items avec une quantité supérieure à 0 pour le select
        const items = await Item.find({ quantity: { $gt: 0 } });
        res.render('list/listEdit.ejs', { list, items });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
};

exports.updateList = async (req, res) => {
    try {
        console.log('req.body:', req.body);

        const listId = req.params.id;
        const { listName, description, itemId, stockQuantity } = req.body;

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).send('Liste non trouvée');
        }

        // Mettre à jour nom + description
        list.name = listName;
        list.description = description;

        // Gérer l'ajout d'item (optionnel) si présent dans req.body
        if (itemId && itemId.trim() !== '') {
            list.items = list.items || [];
            const itemAlreadyInList = list.items.some(existingItemId => existingItemId.toString() === itemId);
            if (!itemAlreadyInList) {
                list.items.push(itemId);
                console.log(`Item ${itemId} ajouté à la liste.`);
            } else {
                console.log("Item déjà présent dans la liste.");
            }
            // Optionnel : gérer la quantité stockQuantity si nécessaire
        }

        await list.save();
        console.log('Liste sauvegardée avec succès.');
        res.redirect('/listes');
    } catch (err) {
        console.error('Erreur dans updateList:', err);
        res.status(500).send('Erreur Serveur');
    }
};

exports.deleteList = async (req, res) => {
    try {
        await List.findByIdAndDelete(req.params.id);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addNewItemToList = async (req, res) => {
    try {
      const { id } = req.params;
      const { itemId, itemQuantity } = req.body;
      const parsedQty = parseInt(itemQuantity, 10) || 1;
  
      // Récupérer l'item de référence (pour obtenir son nom, etc.)
      const baseItem = await Item.findById(itemId);
      if (!baseItem) return res.status(404).send("Item source introuvable");
  
      // Créer un nouvel item en base (même si c'est un doublon) avec la quantité fournie
      const newItem = new Item({
        name: baseItem.name,
        // Ajoutez ici d'autres champs si nécessaire
        quantity: parsedQty
      });
      await newItem.save();
  
      // Ajouter cet item à la liste
      const list = await List.findById(id);
      if (!list) return res.status(404).send("Liste introuvable");
      list.items = list.items || [];
      list.items.push(newItem._id);
      await list.save();
  
      res.redirect('/listes/' + id);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur Serveur");
    }
  };

exports.deleteItemFromList = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).send('Liste non trouvée');
        }
        // S'assurer que list.items est défini
        list.items = list.items || [];
        list.items = list.items.filter(item => item.toString() !== itemId);
        await list.save();
        res.redirect('/listes/' + id);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
};