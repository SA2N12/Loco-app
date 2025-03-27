const { body, validationResult } = require('express-validator');
const List = require('../models/list');
const Item = require('../models/Item');
const Stock = require('../models/Stock');

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

        // Récupérer la liste avec les items peuplés
        const list = await List.findById(listId).populate('items.item');
        if (!list) return res.status(404).send('Liste introuvable');

        // Récupérer les items disponibles pour le select
        const items = await Item.find({});

        // Récupérer tous les stocks
        const stocks = await Stock.find({}).populate('item');

        // Rendre la vue avec les données mises à jour
        res.render('list/listEdit.ejs', { list, items, stocks });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur Serveur");
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
            list.items.push({ item: itemId, listQuantity: stockQuantity });
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
        const { id } = req.params;                  // id de la liste
        const { itemId, itemQuantity } = req.body;   // quantité demandée dans la liste
        const parsedQty = parseInt(itemQuantity, 10) || 1;

        // Vérifier que l'item de référence existe
        const baseItem = await require('../models/Item').findById(itemId);
        if (!baseItem) return res.status(404).send("Item source introuvable");

        const list = await List.findById(id);
        if (!list) return res.status(404).send("Liste introuvable");

        // Pour éviter les doublons, on peut vérifier si cet item est déjà dans la liste
        const existing = list.items.find(li => li.item.toString() === itemId);
        if (existing) {
            return res.status(400).send('Cet item est déjà présent dans la liste.');
        }

        // Ajouter à la liste l'item avec la quantité souhaitée (liste indépendante du stock)
        list.items.push({ item: itemId, listQuantity: parsedQty });

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

        // Si itemToRemove.remove() n'est pas défini, utilisez filter pour retirer l'item
        list.items = list.items.filter(item => item._id.toString() !== itemId);
        
        await list.save();
        res.redirect(`/listes/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur Serveur");
    }
};