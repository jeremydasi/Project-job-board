import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';               
import rateLimit from 'express-rate-limit'; 
import { config } from 'dotenv';            
import loginRouter from './login.js';
import registerAdminRouter from './register_admin.js';
import registerClientRouter from './register_client.js';
import registerJobRouter from './register_job.js';
import postulateRouter from './postulate.js';
import cors from "cors";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { __dirname };

const app = express();
const port = 3000;

app.use(helmet());

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3001", credentials: true, }));

app.use('/login', loginLimiter);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'users.db');
const sqlFilePath = process.env.SQL_FILE_PATH || path.join(__dirname, 'user.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
    } else {
        console.log('Base de données SQLite ouverte avec succès.');
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf-8');
        db.exec(sqlScript, (err) => {
            if (err) {
                console.error('Erreur lors de l\'exécution du fichier SQL :', err.message);
            } else {
                console.log('Fichier SQL exécuté avec succès.');
            }
        });
    }
});

app.locals.db = db;

app.use('/', loginRouter);
app.use('/', registerAdminRouter);
app.use('/', registerClientRouter);
app.use('/', registerJobRouter);
app.use('/', postulateRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
});

process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données :', err.message);
        } else {
            console.log('Base de données fermée avec succès.');
        }
    });
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token; 

    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user; 
        next(); 
    });
};

app.listen(port, () => {
    console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});

export default app;
