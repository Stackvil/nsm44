import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

/**
 * @swagger
 * /api/alumni:
 *   get:
 *     tags: [Alumni]
 *     summary: Get all alumni with filters
 *     parameters:
 *       - in: query
 *         name: batchYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of alumni
 */
export const getAllAlumni = async (req: AuthRequest, res: Response) => {
    try {
        const { batchYear, industry, location, search, page = 1, limit = 20 } = req.query;

        const where: any = { isPublic: true, verificationStatus: 'VERIFIED' };

        if (batchYear) where.batchYear = parseInt(batchYear as string);
        if (industry) where.industry = { contains: industry as string, mode: 'insensitive' };
        if (location) where.location = { contains: location as string, mode: 'insensitive' };
        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { company: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [alumni, total] = await Promise.all([
            prisma.alumniProfile.findMany({
                where,
                skip,
                take: parseInt(limit as string),
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    batchYear: true,
                    degree: true,
                    industry: true,
                    company: true,
                    position: true,
                    location: true,
                    skills: true,
                    profileImage: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.alumniProfile.count({ where }),
        ]);

        res.json({
            alumni,
            pagination: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                pages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error: any) {
        throw new AppError(error.message || 'Failed to fetch alumni', 500);
    }
};

export const getAlumniById = async (req: AuthRequest, res: Response) => {
    try {
        // id was unused

        const alumni = await prisma.alumniProfile.findUnique({
            where: { id: req.params.id as string },
            include: { user: { select: { email: true } } },
        });

        if (!alumni) {
            throw new AppError('Alumni not found', 404);
        }

        res.json(alumni);
    } catch (error: any) {
        throw new AppError(error.message || 'Failed to fetch alumni', 500);
    }
};

export const updateAlumniProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const data = req.body;

        const profile = await prisma.alumniProfile.update({
            where: { userId },
            data,
        });

        res.json({ message: 'Profile updated successfully', profile });
    } catch (error: any) {
        throw new AppError(error.message || 'Failed to update profile', 500);
    }
};

export const verifyAlumni = async (req: AuthRequest, res: Response) => {
    try {
        // id was unused
        const { status } = req.body;

        const profile = await prisma.alumniProfile.update({
            where: { id: req.params.id as string },
            data: { verificationStatus: status },
        });

        res.json({ message: 'Verification status updated', profile });
    } catch (error: any) {
        throw new AppError(error.message || 'Failed to verify alumni', 500);
    }
};
