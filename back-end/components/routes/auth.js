import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = express.Router();
const JWT_SECRET = 'votre_clé_secrète';

// Identifiants statiques pour l'administrateur
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'adminpassword';

// Route d'inscription
router.post('/client', async (req, res) => {
    const { prenom, nom, email, password, localisation, type_contract } = req.body;

    try {
        const existingUser = await User.findOne({ where: { user_email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'email est déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ 
            user_firstname: prenom, 
            user_lastname: nom, 
            user_email: email, 
            password: hashedPassword, 
            user_place: localisation, 
            type_contract,
            is_admin: false // Par défaut, les nouveaux utilisateurs ne sont pas administrateurs
        });
        res.status(201).json({ message: 'Inscription réussie.' });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.', error: error.message });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérification des identifiants administrateur
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign({ id: 'admin', email: ADMIN_EMAIL, is_admin: true }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({
                message: 'Connexion administrateur réussie.',
                token,
                user: {
                    id: 'admin',
                    user_firstname: 'Admin',
                    user_lastname: 'Test',
                    user_email: ADMIN_EMAIL,
                    is_admin: true,
                },
            });
        }

        // Cherchez l'utilisateur dans la base de données
        const user = await User.findOne({ where: { user_email: email } });

        // Si l'utilisateur n'existe pas ou si le mot de passe ne correspond pas
        if (!user) {
            return res.status(400).json({ message: 'Identifiants incorrects.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Identifiants incorrects.' });
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user.id, email: user.user_email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' });
        
        // Répondre avec les données de l'utilisateur
        res.json({
            message: 'Connexion réussie.',
            token,
            user: {
                id: user.id,
                user_firstname: user.user_firstname,
                user_lastname: user.user_lastname,
                user_email: user.user_email,
                user_place: user.user_place,
                type_contract: user.type_contract,
                is_admin: user.is_admin,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
    }
});

// Route de vérification de session mise à jour
router.get('/check-session', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ loggedIn: false, message: 'Non autorisé' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Récupérer les informations de l'utilisateur
        let user;
        if (userId === 'admin') {
            user = {
                id: 'admin',
                user_firstname: 'Admin',
                user_lastname: 'Test',
                user_email: ADMIN_EMAIL,
                is_admin: true,
            };
        } else {
            user = await User.findByPk(userId);
        }

        if (user) {
            return res.status(200).json({
                loggedIn: true,
                user,
            });
        } else {
            return res.status(404).json({ loggedIn: false, message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return res.status(401).json({ loggedIn: false, message: 'Token invalide' });
    }
});

// Route de mise à jour de session
router.post('/update-session', async (req, res) => {
    const { id, user_firstname, user_lastname, user_email, user_place, type_contract } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Mettre à jour les informations de l'utilisateur
        user.user_firstname = user_firstname || user.user_firstname;
        user.user_lastname = user_lastname || user.user_lastname;
        user.user_email = user_email || user.user_email;
        user.user_place = user_place || user.user_place;
        user.type_contract = type_contract || user.type_contract;

        await user.save(); // Enregistrer les modifications

        const updatedUser = await User.findByPk(id);
        console.log("Utilisateur mis à jour dans la base de données :", updatedUser);
        res.status(200).json({ message: 'Mise à jour réussie.', user: updatedUser });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour.', error: error.message });
    }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie.' });
});

export default router;
