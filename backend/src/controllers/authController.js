const { getDatabase } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure Email Transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const AuthController = {
    // 1. Send OTP
    async sendOTP(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const db = getDatabase();

        // Check if user already exists
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) return res.status(400).json({ error: 'User already exists. Please login.' });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins

        try {
            // Store/Update OTP
            await db.run(
                `INSERT INTO otp_verification (email, otp, expires_at) 
         VALUES (?, ?, ?) 
         ON CONFLICT(email) DO UPDATE SET otp = ?, expires_at = ?`,
                [email, otp, expiresAt, otp, expiresAt]
            );

            // Send Email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'NSMOSA Verification OTP',
                text: `Your verification code is: ${otp}. It expires in 5 minutes.`
            });

            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (err) {
            console.error('OTP Error:', err);
            res.status(500).json({ error: 'Failed to send OTP' });
        }
    },

    // 2. Verify OTP and Create temp verification state or just verify
    // For simplicity: We will rely on the SignUp call to verify OTP again or use a verified flag?
    // Let's have a verify endpoint that just checks validity.
    async verifyOTP(req, res) {
        const { email, otp } = req.body;
        const db = getDatabase();

        const record = await db.get('SELECT * FROM otp_verification WHERE email = ?', [email]);

        if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
        if (new Date(record.expires_at) < new Date()) return res.status(400).json({ error: 'OTP expired' });
        if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

        res.status(200).json({ message: 'OTP verified successfully' });
    },

    // 3. Signup (Verify OTP one last time and Create User)
    async signup(req, res) {
        const { name, email, password, role, otp } = req.body;

        if (!name || !email || !password || !role || !otp) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Role Validation
        const validRoles = ['super_admin', 'admin', 'rep_admin', 'user'];
        if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

        const db = getDatabase();

        // Verify OTP again to be sure
        const record = await db.get('SELECT * FROM otp_verification WHERE email = ?', [email]);
        if (!record || record.otp !== otp || new Date(record.expires_at) < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            await db.run(
                'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, 1)',
                [name, email, hashedPassword, role]
            );

            // Clean up OTP
            await db.run('DELETE FROM otp_verification WHERE email = ?', [email]);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Signup Error:', err);
            res.status(500).json({ error: 'Registration failed' });
        }
    },

    // 4. Login
    async login(req, res) {
        const { email, password } = req.body;
        const db = getDatabase();

        try {
            const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
            if (!user) return res.status(400).json({ error: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            console.error('Login Error:', err);
            res.status(500).json({ error: 'Login failed' });
        }
    }
};

module.exports = AuthController;
