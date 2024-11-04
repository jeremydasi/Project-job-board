import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbPromise from './database.js';

const router = express.Router();
const JWT_SECRET = 'votre_clé_secrète';

// Fonction pour créer un administrateur par défaut
const createDefaultAdmin = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS administrateur (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_firstname TEXT NOT NULL,
            admin_lastname TEXT NOT NULL,
            admin_mail TEXT NOT NULL UNIQUE,
            admin_password TEXT NOT NULL,
            name_company TEXT NOT NULL
        );
    `;

    await db.run(query);

    const existingAdmin = await db.get("SELECT * FROM administrateur WHERE admin_mail = ?", ['admin@example.com']);

    if (existingAdmin) {
        console.log('L\'administrateur par défaut existe déjà.');
        return;
    }

    // Hachez le mot de passe de l'administrateur par défaut
    const hashedPassword = await bcrypt.hash('admin1234', 10); // Mot de passe par défaut

    // Insérer l'administrateur par défaut
    await db.run(
        `INSERT INTO administrateur (admin_firstname, admin_lastname, admin_mail, admin_password, name_company) VALUES (?, ?, ?, ?, ?)`,
        ['Admin', 'Default', 'admin@example.com', hashedPassword, 'Default Company']
    );

    console.log('Administrateur par défaut créé avec succès.');
};

// Route d'inscription pour les administrateurs
router.post('/signup', async (req, res) => {
    const { prenom, nom, email, password, name_company } = req.body;

    const db = await dbPromise; // Obtenez l'instance de la base de données

    try {
        const existingAdmin = await db.get("SELECT * FROM administrators WHERE admin_mail = ?", [email]);

        if (existingAdmin) {
            return res.status(400).json({ message: 'L\'email est déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
            `INSERT INTO administrators (admin_firstname, admin_lastname, admin_mail, admin_password, name_company) VALUES (?, ?, ?, ?, ?)`,
            [prenom, nom, email, hashedPassword, name_company]
        );

        res.status(201).json({ message: 'Inscription réussie.' });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.', error: error.message });
    }
});

// Route de connexion pour les administrateurs
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const db = await dbPromise;

    try {
        const admin = await db.get("SELECT * FROM administrators WHERE admin_mail = ?", [email]);

        if (!admin || !(await bcrypt.compare(password, admin.admin_password))) {
            return res.status(400).json({ message: 'Identifiants incorrects.' });
        }

        const token = jwt.sign({ id: admin.id, email: admin.admin_mail }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Connexion réussie.', token });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
    }
});

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Non autorisé

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Interdit
        req.user = user; // Attacher les données utilisateur à la requête
        next(); // Passer au prochain middleware
    });
};

// Route de vérification de session
router.get('/check-session', authenticateToken, async (req, res) => {
    const db = await dbPromise; // Obtenez l'instance de la base de données

    try {
        const admin = await db.get("SELECT * FROM administrators WHERE id = ?", [req.user.id]);

        if (admin) {
            return res.status(200).json({
                loggedIn: true,
                admin: {
                    id: admin.id,
                    admin_firstname: admin.admin_firstname,
                    admin_lastname: admin.admin_lastname,
                    admin_mail: admin.admin_mail,
                    name_company: admin.name_company,
                },
            });
        } else {
            return res.status(404).json({ loggedIn: false, message: 'Administrateur non trouvé' });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return res.status(401).json({ loggedIn: false, message: 'Token invalide' });
    }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie.' });
});

// Initialisez l'application et créez un administrateur par défaut
const initializeApp = async () => {
    const db = await dbPromise; // Obtenez l'instance de la base de données
    await createDefaultAdmin(db); // Créez l'administrateur par défaut
    // Vous pouvez démarrer votre serveur ici
};

// N'oubliez pas d'appeler initializeApp pour créer l'admin par défaut lors du démarrage
initializeApp();

export default router;
