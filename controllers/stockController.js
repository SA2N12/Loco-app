const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');

exports.getStocks = async (req, res) => {
    try {
        // Récupérer uniquement les items dont la quantité est supérieure à 0
        const items = await Item.find({ quantity: { $gt: 0 } }).sort({ createdAt: -1 });
        res.render('stock/stocks', { 
            items,
            errors: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createStock = [
    // Valider que le nom ne soit pas vide
    body('stockName').notEmpty().withMessage('Le nom du stock est obligatoire'),
    
    async (req, res) => {
        const errors = validationResult(req);
        const stocks = await Item.find();
        
        // En cas d'erreur de validation
        if (!errors.isEmpty()) {
            return res.render('stock/stocks', { 
                errors: errors.array(), 
                stocks 
            });
        }
        
        try {
            // Vérifier si un item avec ce nom existe déjà
            const stockExists = await Item.findOne({ name: req.body.stockName });
            if (stockExists) {
                return res.render('stock/stocks', { 
                    errors: [{ msg: 'Ce stock existe déjà' }], 
                    stocks 
                });
            }
            
            // Créer et sauvegarder le nouvel item
            const newItem = new Item({
                name: req.body.stockName,
                quantity: req.body.stockQuantity,
                createdAt: new Date()
            });
            
            await newItem.save();
            res.redirect('/stocks');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
];

exports.getStock = async (req, res) => {
    try {
        const stockId = req.params.id;
        const stock = await Item.findById(stockId);
        if (!stock) {
            return res.status(404).send("Stock non trouvé");
        }
        return res.render('stock/stockEdit', { stock });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');   
    }
};

exports.updateStock = async (req, res) => {
    try {
        const stockId = req.params.id;
        const updatedStock = await Item.findByIdAndUpdate(
            stockId,
            { 
                name: req.body.stockName, 
                quantity: req.body.stockQuantity 
            },
            { new: true }
        );
        if (!updatedStock) {
            return res.status(404).send('Stock not found');
        }
        res.redirect('/stocks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteStock = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/stocks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};