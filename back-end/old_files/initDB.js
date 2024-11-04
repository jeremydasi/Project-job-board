import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./user.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO users (email, password) VALUES
        ('test@example.com', '12345'),
        ('admin@example.com', 'admin')
    `);
});

db.close();
