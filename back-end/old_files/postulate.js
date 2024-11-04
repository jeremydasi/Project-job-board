import express from 'express';
import path from 'path';
import { __dirname } from './config.js';

const router = express.Router(); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/postulate', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', '_.html'));
});

router.post('/postulate', (req, res) => {
    const { prenom, nom, email, password, localisation } = req.body;

    const query = `
        INSERT INTO resumes (file_name, file_type, user_email, password, user_place) 
        VALUES (?, ?, ?, ?, ?)
    `;

    req.app.locals.db.run(query, [prenom, nom, email, password, localisation], function(err) {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err.message);
            return res.status(500).send('Erreur lors de l\'enregistrement des données.');
        }
        console.log(`Utilisateur ajouté avec l'ID ${this.lastID}`);
        res.send('Utilisateur enregistré avec succès.');
    });
});

export default router;


