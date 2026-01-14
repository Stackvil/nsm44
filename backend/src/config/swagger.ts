import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NSM OSA Alumni Portal API',
            version: '1.0.0',
            description: 'Complete REST API for NSM OSA Alumni Networking & Engagement Portal',
            contact: {
                name: 'NSM OSA',
                email: 'support@nsmosa.edu',
            },
        },
        servers: [
            {
                url: config.apiUrl,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            { name: 'Authentication', description: 'User authentication and authorization' },
            { name: 'Alumni', description: 'Alumni profile management' },
            { name: 'Jobs', description: 'Job postings and applications' },
            { name: 'Mentorship', description: 'Mentorship matching and requests' },
            { name: 'Events', description: 'Events and reunions management' },
            { name: 'Donations', description: 'Donation processing and tracking' },
            { name: 'Store', description: 'E-commerce and merchandise' },
            { name: 'Admin', description: 'Admin dashboard and management' },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
