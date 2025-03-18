const { body, validationResult } = require('express-validator');
const Stock = require('../models/Stock');
const Item = require('../models/Item');

exports.getStocks = async (req, res) => {
    try {
        // Récupérer uniquement les items dont la quantité est supérieure à 0
        const items = await Item.find({ quantity: { $gt: 0 } }).sort({ createdAt: -1 });
        res.render('stock/stocks', { 
            stocks: items,
            errors: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createStock = [
    // Valider que le nom du stock n'est pas vide
    body('stockName').notEmpty().withMessage('Le nom du stock est obligatoire'),
    
    async (req, res) => {
        const errors = validationResult(req);
        const stocks = await Stock.find();
        
        // En cas d'erreur de validation
        if (!errors.isEmpty()) {
            return res.render('stock/stocks', { 
                errors: errors.array(), 
                stocks 
            });
        }
        
        try {
            // Vérifier si un stock avec ce nom existe déjà
            const stockExists = await Stock.findOne({ name: req.body.stockName });
            if (stockExists) {
                return res.render('stock/stocks', { 
                    errors: [{ msg: 'Ce stock existe déjà' }], 
                    stocks 
                });
            }
            
            // Créer et sauvegarder le nouveau stock
            const newStock = new Stock({
                name: req.body.stockName,
                quantity: req.body.stockQuantity,
                createdAt: new Date()
            });
            
            await newStock.save();
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
        const stock = await Stock.findById(stockId);
        return res.render('stock/stockEdit', { stock });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');   
    }
};

exports.updateStock = async (req, res) => {
    try {
        const stockId = req.params.id;
        const updatedStock = await Stock.findByIdAndUpdate(
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
        await Stock.findByIdAndDelete(req.params.id);
        res.redirect('/stocks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};