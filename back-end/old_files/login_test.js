import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { __dirname } from './config.js'; 
import Database from 'better-sqlite3'; // Importer le module

const router = express.Router();
const db = new Database('users.db'); // Initialiser la base de données
const email = "papa@example.com"; // Email de test
const password = "ma_fille"; // Mot de passe à hacher

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Route pour servir la page de login
router.get('/login', (req, res) => {
    console.log('GET /login - Servir la page de login');
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

router.post('/insert-test-user', async (req, res) => {
    const email = "papa@example.com"; // Email de test
    const password = "ma_fille"; // Mot de passe à hacher
    console.log('POST /insert-test-user - Insertion d\'un utilisateur de test');

    // Hachage du mot de passe
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Mot de passe haché:', hashedPassword); // Affiche le mot de passe haché dans la console
        
        // Insertion de l'utilisateur dans la base de données
        db.prepare('INSERT INTO users (user_email, password) VALUES (?, ?)').run(email, hashedPassword);
        console.log('Utilisateur de test inséré avec succès:', { email, hashedPassword });

        res.status(200).json({ message: 'Utilisateur de test inséré avec succès.' });
    } catch (err) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur de test:', err);
        res.status(500).json({ message: 'Erreur lors de l\'insertion de l\'utilisateur.' });
    }
});


// Route pour afficher tous les utilisateurs
router.get('/users', (req, res) => {
    console.log('GET /users - Récupération de tous les utilisateurs');
    try {
        const users = db.prepare('SELECT * FROM users').all(); // Récupérer tous les utilisateurs
        console.log('Liste des utilisateurs:', users); // Affiche la liste des utilisateurs
        res.status(200).json(users); // Retourner les utilisateurs sous forme de JSON
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

// Route pour le login avec vérification du mot de passe
router.post('/login', (req, res) => {
    const { email, password } = req.body; // Récupérer l'email et le mot de passe de la requête
    console.log('POST /login - Tentative de connexion avec:', { email, password });

    // Rechercher l'utilisateur par son email uniquement
    const stmt = db.prepare('SELECT * FROM users WHERE user_email = ?');
    const user = stmt.get(email); // Utiliser stmt.get pour récupérer l'utilisateur

    // Afficher la base de données entière pour débogage
    console.log('Vérification de l\'existence de l\'utilisateur. Liste des utilisateurs en base de données :');
    const allUsers = db.prepare('SELECT * FROM users').all();
    console.log(allUsers); // Affiche tous les utilisateurs

    if (!user) {
        console.warn('Email non trouvé:', email); 
        return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    // Comparaison du mot de passe en utilisant bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.error('Erreur lors de la vérification du mot de passe:', err);
            return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
        }

        console.log('Résultat de la comparaison:', result); // Affiche le résultat de la comparaison

        if (result) {
            // Si le mot de passe correspond, on génère un token JWT
            try {
                const token = jwt.sign(
                    { id: user.id, email: user.user_email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Redirection vers une page après connexion réussie
                res.cookie('auth_token', token, { httpOnly: true, secure: true });
                console.log('Token JWT généré avec succès pour l\'utilisateur:', { id: user.id, email: user.user_email });
                res.redirect('/'); // Redirige vers la page dashboard ou celle que vous souhaitez

            } catch (jwtError) {
                console.error('Erreur lors de la génération du token JWT:', jwtError);
                return res.status(500).json({ message: 'Erreur interne lors de la génération du token.' });
            }
        } else {
            console.warn('Mot de passe incorrect pour:', email); 
            console.log(hashedPassword);
            res.status(401).json({ message: 'Identifiants incorrects.' });
        }
    });
});

// Page protégée, par exemple "/dashboard"
router.get('/dashboard', (req, res) => {
    console.log('GET /dashboard - Vérification du token');
    const token = req.cookies.auth_token;
    if (!token) {
        console.warn('Aucun token trouvé, redirection vers /login');
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token validé, utilisateur:', decoded);
        res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
    } catch (err) {
        console.error('Erreur lors de la validation du token:', err);
        res.clearCookie('auth_token');
        console.log('Token invalide, redirection vers /login');
        res.redirect('/login');
    }
});

export default router;
