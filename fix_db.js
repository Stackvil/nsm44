const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Users_backup", (err) => {
        if (err) {
            console.error("Error dropping table:", err);
        } else {
            console.log("Users_backup table dropped successfully.");
        }
    });
});

db.close();
