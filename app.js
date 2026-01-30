const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const { initDb, User, Content } = require('./models');

// Init Database
initDb().then(async () => {
    // Check if super admin exists, if not create one
    const count = await User.count();
    if (count === 0) {
        await User.create({
            username: 'admin',
            email: 'admin@nsm.com',
            password: '12345',
            role: 'super_admin',
            isActive: true,
            membershipStatus: 'active'
        });
        await User.create({
            username: 'admin1',
            email: 'admin1@nsm.com',
            password: '12345',
            role: 'admin',
            isActive: true,
            membershipStatus: 'active'
        });
        await User.create({
            username: 'rep_admin',
            email: 'rep@nsm.com',
            password: '12345',
            role: 'rep_admin',
            isActive: true,
            membershipStatus: 'active'
        });
        await User.create({
            username: 'user',
            email: 'user@nsm.com',
            password: '12345',
            role: 'user',
            isActive: true,
            membershipStatus: 'active'
        });
        console.log('Default Admins created: admin / 12345');
    }

    const fs = require('fs');

    // Check for content
    const contentCount = await Content.count();
    if (contentCount === 0) {
        console.log('Seeding database from public/images...');

        const seedConfig = [
            { path: 'HOME PAGE PHOTOS NSM', section: 'home', titlePrefix: 'NSM Highlight' },
            { path: 'golden-jubilee-celebrations', section: 'events', titlePrefix: 'Golden Jubilee' },
            { path: 'social-events', section: 'events', titlePrefix: 'Social Event' }
        ];

        const contentToCreate = [];

        for (const config of seedConfig) {
            const dirPath = path.join(__dirname, 'public', 'images', config.path);
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath);

                files.forEach((file, index) => {
                    if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
                        // Create a URL-friendly path, ensuring we encode spaces for the browser but keep the structure
                        const webPath = `/images/${config.path}/${file}`;

                        contentToCreate.push({
                            title: `${config.titlePrefix} ${index + 1}`,
                            description: `Imported from ${config.path}`,
                            imageUrl: webPath,
                            section: config.section,
                            isVisible: true
                        });
                    }
                });
            } else {
                console.log(`Directory not found: ${dirPath}`);
            }
        }

        if (contentToCreate.length > 0) {
            await Content.bulkCreate(contentToCreate);
            console.log(`Seeded ${contentToCreate.length} images.`);
        } else {
            console.log('No images found to seed.');
        }
    }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
