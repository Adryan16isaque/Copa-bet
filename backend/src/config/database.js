const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database/database.db');
const schemaPath = path.resolve(__dirname, '../database/schema.sql');
const seedPath = path.resolve(__dirname, '../database/seed.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seed = fs.readFileSync(seedPath, 'utf8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Error applying schema:', err.message);
        } else {
            console.log('Schema applied successfully.');
            db.exec(seed, (err) => {
                if (err) {
                    console.error('Error applying seed:', err.message);
                } else {
                    console.log('Seed data applied successfully.');
                }
            });
        }
    });
}

module.exports = db;
