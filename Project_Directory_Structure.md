# Project Directory Structure

This document explains the structure of the project directory for your reference. Please follow this as a guideline when adding or modifying files in the project.

## Project Root Directory Structure:


## Explanation of Each Subdirectory and File:

### `/client` 
Contains all the code related to the front-end of the application built with React.
- **`/public`**: Contains static assets like `index.html`, images, and icons that the React app might use.
- **`/src`**: Contains the actual React code, including components, pages, and services.
  - **`/components`**: Reusable React components (e.g., buttons, form elements).
  - **`/pages`**: Pages that are mapped to specific routes (URLs).
  - **`/services`**: Responsible for handling API requests to the backend.
  - **`/styles`**: CSS/SCSS files to style the application.
  - **`/utils`**: Utility functions used across multiple components.
  - **`App.js`**: Main React component, where the routes and main structure of the app reside.
  - **`index.js`**: Entry point for the React application; renders the React app.

### `/server` 
Contains the code for the back-end of the application built using Node.js and Express.
- **`/config`**: Configuration files for database connections and environment variables.
- **`/controllers`**: Functions that handle HTTP requests and responses.
- **`/models`**: Defines the structure of data (database models).
- **`/routes`**: API endpoints handling HTTP requests.
- **`/middleware`**: Functions executed during the request/response cycle, such as authentication or logging.
- **`/utils`**: Utility functions or helper modules for backend logic.
- **`index.js`**: Entry point of the Express server.

### `/scripts` 
Scripts for deployment or automation processes.

### `/test` 
Contains test files for both the client and server code.

### `/assets` 
Shared assets between the client and server, such as logos or icons.

### `.gitignore` 
Specifies files and folders that should be ignored by Git (e.g., `node_modules`).

### `package.json` 
Manages project dependencies and scripts for both the front-end and back-end.

### `README.md` 
Documentation of the project, explaining what the project does, how to install and run it.

### `docker-compose.yml` 
Optional file for containerizing the application using Docker, useful for multi-container apps (e.g., database and server).

---

This structure allows clear separation between the front-end and back-end, helping to keep the project organized and scalable.
