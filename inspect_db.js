const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) console.error(err);
        console.log('Tables:', tables);
    });

    db.all("SELECT id, count(*) as c FROM Users GROUP BY id HAVING c > 1", (err, rows) => {
        if (err) console.error("Error checking duplicates:", err);
        else console.log('Duplicate IDs in Users:', rows);
    });

    db.all("SELECT * FROM Users", (err, rows) => {
        if (err) console.log("Users table error (maybe missing):", err.message);
        else console.log(`Total Users: ${rows.length}`);
    });
});

db.close();
