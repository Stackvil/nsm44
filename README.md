# NSM Alumni Association Web App

A full-stack web application built with Express.js, SQLite, and Tailwind CSS.

## Features
- **Modern UI**: Utilizing glassmorphism, gradients, and a responsive design.
- **Role-Based Access Control**:
  - **Super Admin / Admin**: Full control to create, edit, and delete content.
  - **Representative Admin**: Read-only access to the dashboard. Can request changes via email link.
  - **User**: Public access to home page and events.
- **Dynamic Content**: Manage home page gallery and news from the dashboard.
- **Image Gallery**: Carousel and masonry grid showcasing uploaded images.
- **Cloud Ready**: Configured for AWS RDS (Postgres/MySQL) and S3 for storage.
- **Payment Structure**: Basic routing and controllers set up for Stripe integration.

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: 
  - **Dev**: SQLite
  - **Prod**: PostgreSQL / MySQL (Configured for RDS)
- **Frontend**: EJS Templates, Tailwind CSS
- **Authentication**: `express-session`, `bcryptjs`
- **Cloud/DevOps**: AWS SDK, Sequelize CLI, Multer S3

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file in the root directory (see `.env.example` or below):
    ```properties
    NODE_ENV=development
    PORT=3030
    # Add AWS/Stripe keys for production
    ```

3.  **Database Migration (Optional for Dev, Required for Prod)**:
    ```bash
    npx sequelize-cli db:migrate
    ```

4.  **Start the Server**:
    *   **Development**: `npm run dev` (with hot-reload)
    *   **Production**: `npm start`

5.  **Access the App**:
    Open [http://localhost:3030](http://localhost:3030) in your browser.

## AWS & Cloud Deployment
The application is configured to automatically switch to AWS RDS and S3 when `NODE_ENV=production`.
- **Database**: Update `DB_HOST`, `DB_USERNAME`, etc. in `.env`.
- **Storage**: Set `AWS_BUCKET_NAME` and credentials to enable S3 uploads.

## Default Credentials
- **Username**: `admin`
- **Password**: `12345`
- **Role**: Super Admin

## Project Structure
- `public/`: Static assets (images, CSS).
- `views/`: EJS templates for the frontend.
- `routes/`: Express route definitions.
- `models/`: Database models (User, Content).
- `config/`: Database configuration.
