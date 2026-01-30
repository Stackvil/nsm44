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

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite (with Sequelize ORM)
- **Frontend**: EJS Templates, Tailwind CSS
- **Authentication**: `express-session`, `bcryptjs`

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    node app.js
    ```

3.  **Access the App**:
    Open [http://localhost:3030](http://localhost:3030) in your browser.

## Default Credentials
- **Username**: `admin`
- **Password**: `password123`
- **Role**: Super Admin

## Project Structure
- `public/`: Static assets (images, CSS).
- `views/`: EJS templates for the frontend.
- `routes/`: Express route definitions.
- `models/`: Database models (User, Content).
- `config/`: Database configuration.
