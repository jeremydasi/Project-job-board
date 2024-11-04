import express from 'express';
import path from 'path';
import { __dirname } from './config.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cookieParser from 'cookie-parser';

const router = express.Router(); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/client', async (req, res) => {
    const { prenom, nom, email, password, localisation, type_contract } = req.body;

    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Requête d'insertion
        const query = `
            INSERT INTO users (user_firstname, user_lastname, user_email, password, user_place, type_contract) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Exécution de la requête
        req.app.locals.db.run(query, [prenom, nom, email, hashedPassword, localisation, type_contract], function(err) {
            if (err) {
                console.error('Erreur lors de l\'insertion des données :', err.message);
                return res.status(500).json({ message: 'Erreur lors de l\'enregistrement des données.' });
            }
            console.log(`Utilisateur ajouté avec l'ID ${this.lastID}`);
            res.json({ message: 'Utilisateur enregistré avec succès.' });
        });
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json({ message: 'Erreur lors du traitement de la requête.' });
    }
});

export default router;
