import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cookieParser from 'cookie-parser';

dotenv.config({ path: './.env' });

const dbPromise = open({
    filename: './users.db',
    driver: sqlite3.Database
});

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé : Token manquant' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Le token est expiré, on récupère les infos du payload sans vérifier le token
                const decoded = jwt.decode(token);

                if (decoded && decoded.id && decoded.email) {
                    console.log(`Token expiré pour l'utilisateur ou administrateur ID: ${decoded.id}`);

                    // Générer un nouveau token à partir des infos du payload
                    const newToken = jwt.sign(
                        { id: decoded.id, email: decoded.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );

                    // Ajouter le nouveau token dans les cookies
                    res.cookie('auth_token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                    // Retourner le nouveau token dans la réponse
                    return res.status(200).json({
                        message: 'Votre session a expiré, mais un nouveau token a été généré. Réessayez l\'action avec le nouveau token.',
                        token: newToken
                    });
                } else {
                    return res.status(403).json({ message: 'Erreur lors du décodage du token expiré.' });
                }
            } else {
                return res.status(403).json({ message: 'Token invalide' });
            }
        } else {
            // Si le token est valide, on passe à la suite
            req.admin = decodedToken; // Stocker les infos du token
            next();
        }
    });
};

// Route pour mettre à jour l'administrateur
router.put('/update_admin', authenticateToken, async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email et nouveau mot de passe sont requis.' });
    }

    try {
        const db = await dbPromise;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.run('UPDATE administrateur SET admin_mail = ?, admin_password = ? WHERE id = ?', [email, hashedPassword, req.admin.id]);

        const newToken = jwt.sign({ id: req.admin.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('auth_token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Informations administrateur mises à jour avec succès.', token: newToken });
    } catch (err) {
        console.error('Erreur lors de la mise à jour des données :', err.message);
        res.status(500).json({ message: 'Erreur lors de la mise à jour des données.' });
    }
});

// Route pour renouveler un token manuellement
router.post('/refresh_token', authenticateToken, async (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).send('Accès refusé : Token manquant');
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Récupérer les informations du token expiré
                const decoded = jwt.decode(token);
                if (decoded && decoded.id && decoded.email) {
                    console.log(`Renouvellement de token pour l'utilisateur ou administrateur ID: ${decoded.id}`);

                    // Générer un nouveau token
                    const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('auth_token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                    return res.json({ message: 'Token renouvelé avec succès.', token: newToken });
                } else {
                    return res.status(403).json({ message: 'Erreur lors du décodage du token expiré.' });
                }
            } else {
                return res.status(403).json({ message: 'Token invalide.' });
            }
        } else {
            res.json({ message: 'Le token est encore valide.', token });
        }
    });
});

// Route pour insérer un utilisateur de test
router.get('/insert-test-user', async (req, res) => {
    const email = "papa@example.com"; // Email de test
    const password = "ma_fille"; // Mot de passe à hacher
    console.log('Insertion d\'un utilisateur de test');

    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Mot de passe haché:', hashedPassword);

        // Essayer d'insérer l'utilisateur avec des tentatives en cas de base de données occupée
        for (let attempts = 0; attempts < 5; attempts++) {
            try {
                // Essayer d'insérer l'utilisateur
                db.prepare('INSERT INTO users (user_firstname, user_lastname, user_email, password, user_place, type_contract) VALUES (?, ?, ?, ?, ?, ?)')
                    .run('Test', 'User', email, hashedPassword, 2, 2);
                console.log('Utilisateur de test inséré avec succès:', { email, hashedPassword });
                return res.status(200).json({
                    message: 'Utilisateur de test inséré avec succès.',
                    hashedPassword: hashedPassword
                });
            } catch (err) {
                if (err.code === 'SQLITE_BUSY') {
                    console.warn('Base de données occupée, nouvel essai dans 100 ms...');
                    await sleep(100); // Attendre 100 ms avant de réessayer
                } else {
                    console.error('Erreur lors de l\'insertion de l\'utilisateur de test:', err);
                    return res.status(500).json({ message: 'Erreur lors de l\'insertion de l\'utilisateur.' });
                }
            }
        }

        return res.status(500).json({ message: 'Erreur lors de l\'insertion de l\'utilisateur, base de données occupée.' });
    } catch (err) {
        console.error('Erreur lors de l\'hachage du mot de passe:', err);
        res.status(500).json({ message: 'Erreur lors de l\'insertion de l\'utilisateur.' });
    }
});

// Route de connexion pour administrateurs
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body; // Récupérer l'email et le mot de passe de la requête
    console.log('Tentative de connexion admin avec:', { email });

    try {
        // Connexion à la base de données
        const db = await dbPromise;

        // Rechercher l'administrateur par son email uniquement
        const admin = await db.get('SELECT * FROM administrateur WHERE admin_mail = ?', [email]);

        // Vérifier si l'administrateur existe
        if (!admin) {
            console.warn('Email admin non trouvé:', email);
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        // Comparaison du mot de passe en utilisant bcrypt
        const passwordMatch = await bcrypt.compare(password, admin.admin_password);

        if (passwordMatch) {
            // Si le mot de passe correspond, on génère un token JWT
            const token = jwt.sign(
                { id: admin.id, email: admin.admin_mail, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Stocker le token dans un cookie sécurisé
            res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            console.log('Administrateur connecté avec succès:', { id: admin.id, email: admin.admin_mail });
            return res.status(200).json({
                message: 'Connexion administrateur réussie.',
                token
            });
        } else {
            console.warn('Mot de passe admin incorrect pour:', email);
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }
    } catch (err) {
        console.error('Erreur lors de la connexion admin:', err);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});


// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Récupérer l'email et le mot de passe de la requête
    console.log('Tentative de connexion avec:', { email, password });

    // Rechercher l'utilisateur par son email uniquement
    const stmt = db.prepare('SELECT * FROM users WHERE user_email = ?');
    const user = stmt.get(email); // Utiliser stmt.get pour récupérer l'utilisateur

    // Vérifier si l'utilisateur existe
    if (!user) {
        console.warn('Email non trouvé:', email);
        return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    // Comparaison du mot de passe en utilisant bcrypt
    const result = await bcrypt.compare(password, user.password);
    if (result) {
        // Si le mot de passe correspond, on sauvegarde l'utilisateur dans la session
        req.session.user = { id: user.id, email: user.user_email };
        console.log('Utilisateur connecté avec succès:', { id: user.id, email: user.user_email });
        return res.redirect('/dashboard'); // Redirige vers la page dashboard ou celle que vous souhaitez
    } else {
        console.warn('Mot de passe incorrect pour:', email);
        return res.status(401).json({ message: 'Identifiants incorrects.' });
    }
});


// Route de déconnexion
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erreur lors de la destruction de la session:', err);
            return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
        }
        res.clearCookie('connect.sid'); // Suppression du cookie de session
        res.status(200).json({ message: 'Déconnexion réussie.' });
    });
});

export default router;