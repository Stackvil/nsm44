import app from './app';
import { config } from './config/env';
import prisma from './config/database';

const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🌍 Environment: ${config.env}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(1);
    });
});
