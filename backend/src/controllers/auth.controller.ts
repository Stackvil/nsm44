import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken, generateRefreshToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';
import crypto from 'crypto';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - batchYear
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               batchYear:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User registered successfully
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, batchYear, degree } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user and profile
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken,
                profile: {
                    create: {
                        firstName,
                        lastName,
                        batchYear: parseInt(batchYear),
                        degree: degree || '',
                    },
                },
            },
            include: { profile: true },
        });

        // TODO: Send verification email

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            userId: user.id,
        });
    } catch (error: any) {
        throw new AppError(error.message || 'Registration failed', error.statusCode || 500);
    }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        // Generate tokens
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.json({
            message: 'Login successful',
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profile: user.profile,
            },
        });
    } catch (error: any) {
        throw new AppError(error.message || 'Login failed', error.statusCode || 500);
    }
};

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify email address
 */
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        const user = await prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!user) {
            throw new AppError('Invalid verification token', 400);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });

        res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
        throw new AppError(error.message || 'Verification failed', error.statusCode || 500);
    }
};

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset
 */
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if email exists
            res.json({ message: 'If email exists, reset link has been sent' });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            },
        });

        // TODO: Send reset email

        res.json({ message: 'If email exists, reset link has been sent' });
    } catch (error: any) {
        throw new AppError(error.message || 'Password reset failed', error.statusCode || 500);
    }
};

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset password with token
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gte: new Date() },
            },
        });

        if (!user) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.json({ message: 'Password reset successful' });
    } catch (error: any) {
        throw new AppError(error.message || 'Password reset failed', error.statusCode || 500);
    }
};
