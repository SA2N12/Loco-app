const { body, validationResult } = require('express-validator');
const Stock = require('../models/stock');

exports.getStock = async (req, res) => {
    res.render('stock/stock.ejs', { errors: [] });
}

exports.createStock = [
    // Valider que le nom du stock n'est pas vide
    body('stockName').notEmpty().withMessage('Le nom du stock est obligatoire'),
    
    async (req, res) => {
        const errors = validationResult(req);
        let stocks = await Stock.find();
        
        // En cas d'erreur de validation
        if (!errors.isEmpty()) {
            return res.render('stocks/stocks', { errors: errors.array(), stocks });
        }
        
        try {
            // Vérifier si un stock avec ce nom existe déjà
            const stockExists = await Stock.findOne({ name: req.body.stockName });
            if (stockExists) {
                return res.render('stocks/stocks', { 
                    errors: [{ msg: 'Ce stock existe déjà' }], 
                    stocks 
                });
            }
            
            // Créer et sauvegarder le nouveau stock
            const newStock = new Stock({
                name: req.body.stockName,
                // autres propriétés si nécessaire
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