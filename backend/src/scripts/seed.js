const { initializeDatabase } = require('../config/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        const db = await initializeDatabase();

        // Default Password
        const password = await bcrypt.hash('password123', 10);

        const users = [
            { name: 'Super Admin', email: 'superadmin@nsm.com', role: 'super_admin' },
            { name: 'Admin', email: 'admin@nsm.com', role: 'admin' },
            { name: 'Rep Admin', email: 'rep@nsm.com', role: 'rep_admin' },
            { name: 'Regular User', email: 'user@nsm.com', role: 'user' }
        ];

        console.log('Seeding Users...');

        for (const u of users) {
            const existing = await db.get('SELECT * FROM users WHERE email = ?', [u.email]);
            if (!existing) {
                await db.run(
                    'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, 1)',
                    [u.name, u.email, password, u.role]
                );
                console.log(`Created user: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
        }

        console.log('Seeding completed.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
