import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get page content by slug
// @route   GET /api/content/:slug
// @access  Public
export const getContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug as string;

        const content = await prisma.pageContent.findUnique({
            where: { slug },
        });

        if (!content) {
            // Return empty object or specific default if not found, 
            // but status 200 so frontend can handle "no content" gracefully
            // or 404 if strictly required. 
            // For this use case, 404 is appropriate as the page *should* exist.
            res.status(404).json({ message: 'Content not found' });
            return;
        }

        res.status(200).json({
            ...content,
            content: content.content ? JSON.parse(content.content) : {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update or Create page content
// @route   PUT /api/content/:slug
// @access  Private (Admin)
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug as string;
        const { content } = req.body;
        // In a real app, you'd get the user ID from req.user
        // const userId = req.user?.id; 

        if (!content) {
            res.status(400).json({ message: 'Content body is required' });
            return;
        }

        const updatedContent = await prisma.pageContent.upsert({
            where: { slug },
            update: {
                content: JSON.stringify(content),
                // updatedBy: userId,
            },
            create: {
                slug,
                content: JSON.stringify(content),
                // updatedBy: userId,
            },
        });

        res.status(200).json({
            ...updatedContent,
            content: JSON.parse(updatedContent.content)
        });
    } catch (error) {
        next(error);
    }
};
