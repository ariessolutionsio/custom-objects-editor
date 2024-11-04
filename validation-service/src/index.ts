import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import bodyParser from 'body-parser';

// Import routes
import ServiceRoutes from './routes/service.route';

// Import logger
import { logger } from './utils/logger.utils';

import { readConfiguration } from './utils/config.utils';
import { errorMiddleware } from './middleware/error.middleware';

const ALLOWED_ORIGINS = ['localhost:3000', 'localhost:3001', 'commercetools.com'];

// Read env variables
readConfiguration();

const PORT = 8080;

// Create the express app
const app: Express = express();
app.disable('x-powered-by');

// Define configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Extract domain from origin
    const domain = origin.replace(/^https?:\/\//, '').split(':')[0];

    // Check if domain matches any allowed origin or is a subdomain of allowed origins
    const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
      // Remove protocol and port if present
      const cleanAllowedOrigin = allowedOrigin.replace(/^https?:\/\//, '').split(':')[0];
      
      return (
        domain === cleanAllowedOrigin || // Exact match
        domain.endsWith('.' + cleanAllowedOrigin) // Subdomain match
      );
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Define routes
app.use('/validation', ServiceRoutes);

// Global error handler
app.use(errorMiddleware);

// Listen the application
const server = app.listen(PORT, () => {
  logger.info(`⚡️ Service application listening on port ${PORT}`);
});

export default server;
