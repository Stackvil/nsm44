import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// @ts-ignore
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFound } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import alumniRoutes from './routes/alumni.routes';
// import jobRoutes from './routes/job.routes'; // Missing
// import eventRoutes from './routes/event.routes'; // Missing
// import donationRoutes from './routes/donation.routes'; // Missing
// import storeRoutes from './routes/store.routes'; // Missing
// import adminRoutes from './routes/admin.routes'; // Missing
import contentRoutes from './routes/content.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
const allowedOrigins = [config.frontend.url, 'http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Logging
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/donations', donationRoutes);
// app.use('/api/store', storeRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
