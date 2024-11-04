import { Sequelize } from 'sequelize';
import path from 'path';
import UserModel from './userModel.js';
import AdministrateurModel from './administrateurModel.js';

// Création de l'instance Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve('users.db'), // Utilisez un chemin absolu
    logging: false,
});

// Importation de vos modèles
const User = UserModel(sequelize); // Appel du modèle User
const Administrateur = AdministrateurModel(sequelize); // Appel du modèle Administrateur

// Synchroniser les modèles avec la base de données
sequelize.sync()
    .then(() => {
        console.log('Base de données synchronisée.');
    })
    .catch(err => {
        console.error('Erreur lors de la synchronisation de la base de données:', err);
    });

// Vérifier la connexion
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
    })
    .catch(err => {
        console.error('Erreur de connexion à la base de données:', err);
    });

// Exportation de l'instance Sequelize et des modèles
export { sequelize, User, Administrateur };
