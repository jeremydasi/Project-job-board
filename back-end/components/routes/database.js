// database.js
import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
    filename: './users.db',
    driver: sqlite3.Database,
});

export default dbPromise; // Exportation par défaut
