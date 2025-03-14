const {body, validationResult} = require('express-validator');
const List = require('../models/list');

exports.getLists = async (req, res) => {
    try {
        const lists = await List.find();
        res.render('lists/lists.ejs', { errors: [], lists });
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
            return res.render('lists/lists.ejs', { errors: errors.array(), lists });
        }
    
        // Vérifier si la liste existe déjà
        let list = lists.find(list => list.name === req.body.listName);
        if (list) {
            errors.errors.push({ msg: 'La liste existe déjà' });
            return res.render('lists/lists.ejs', { errors: errors.array(), lists });
        }
        
        // Créer une nouvelle liste
        let newList = new List({ name: req.body.listName });
        await newList.save();
    
        // Puis rediriger ou re-rendre la page avec la liste mise à jour
        lists = await List.find();
        res.render('lists/lists.ejs', { errors: [], lists });
    }
];

exports.getList = async (req, res) => {
    try {
        const listId = req.params.id;
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).send('Liste introuvable');
        }

        // Exemple : on affiche une vue "listEdit.ejs"
        res.render('lists/listEdit.ejs', { list });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateList = async (req, res) => {
    try {
        console.log('ID reçu:', req.params.id);
        console.log('Données reçues:', req.body);
        
        const updatedList = await List.findByIdAndUpdate(
            req.params.id, 
            {
            name: req.body.listName,
            description: req.body.listDescription 
            },
            { new: true }
        );
        
        console.log('Liste mise à jour:', updatedList);
        
        if (!updatedList) {
            return res.status(404).send('Liste non trouvée');
        }
        
        res.redirect('/listes');
    } catch (err) {
        console.error('Erreur mise à jour:', err);
        res.status(500).send('Server Error: ' + err.message);
    }
  };

  exports.deleteList = async (req, res) => {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.redirect('/listes');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };