import express from 'express';
import path from 'path';
import { __dirname } from './config.js';

const router = express.Router(); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register_admin.html')); 
});

router.post('/admin', (req, res) => {
    const { prenom, nom, email, password, nom_company } = req.body;

    const query = `
        INSERT INTO administrateur (admin_firstname, admin_lastname, admin_mail, admin_password, name_company) 
        VALUES (?, ?, ?, ?, ?)
    `;

    req.app.locals.db.run(query, [prenom, nom, email, password, nom_company], function(err) {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err.message);
            return res.status(500).send('Erreur lors de l\'enregistrement des données.');
        }
        console.log(`Utilisateur ajouté avec l'ID ${this.lastID}`);
        res.send('Utilisateur enregistré avec succès.');
    });
});

export default router;
