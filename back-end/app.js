import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize } from './components/models/index.js';
import authRoutes from './components/routes/auth.js';
import jobRoutes from './components/routes/jobs.js';
import adminRoutes from './components/routes/admin.js';

const app = express();
const PORT = 3000;
const FRONTEND_ORIGIN = 'http://localhost:3001'; // Origine de votre frontend

// Configuration CORS
const corsOptions = {
  origin: FRONTEND_ORIGIN,
  credentials: true, // Autorise les cookies et les informations d'identification
};

// Middleware
app.use(cors(corsOptions)); // Utilisation de CORS avec les options spécifiées
app.use(express.json()); // Middleware pour analyser les JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware pour analyser les URL encodées

// Routes
app.use('/auth', authRoutes); // Utilisation des routes d'authentification
app.use('/', jobRoutes); // Utilisation des routes des emplois
app.use('/', adminRoutes); // Montée des routes d'administration

// Démarrage du serveur et synchronisation de la base de données
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Vérifie la connexion à la base de données
    console.log('Connexion à SQLite réussie.');

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
};

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose a mal tourné !');
});

// Démarrer le serveur
startServer();

export default app;
