# SenseHarvest

SenseHarvest is a full-stack web application designed for monitoring and managing agricultural or environmental data. It provides a comprehensive dashboard to visualize sensor readings, manage inventory, and track employee information.

## Features

- **Dashboard:** A central hub for viewing real-time sensor data and key metrics.
- **Data Visualization:** Graphical representation of sensor data for easy interpretation.
- **Inventory Management:** CRUD functionality to manage inventory items.
- **Employee Management:** Track employee information and logs.
- **User Authentication:** Secure login and registration system with role-based access.
- **AI Chatbot:** An integrated chatbot to assist users.
- **Notifications:** A notification center to alert users about important events.

## Tech Stack

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool and development server.
- **TypeScript:** A typed superset of JavaScript.
- **Tailwind CSS:** A utility-first CSS framework.
- **Radix UI:** A collection of unstyled, accessible UI components.
- **Recharts:** A composable charting library built on React components.
- **Gemini:** Used for an AI Chatbot.

### Backend

- **Node.js:** A JavaScript runtime environment.
- **Express:** A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** A NoSQL document database.
- **Mongoose:** An ODM library for MongoDB and Node.js.
- **Passport.js:** Authentication middleware for Node.js.
- **JWT:** For implementing JSON Web Tokens for secure authentication.

## Hardware

This project integrates with the following IoT hardware components:

-   Soil Sensor
-   RFID Sensor
-   Temperature and Humidity Sensor
-   Gas Sensor
-   Buzzer
-   4x LEDs for status indication

## Project Structure

The project is organized into two main directories:

-   **`/server`**: Contains the backend application built with Node.js and Express. It handles the API endpoints, database interactions, and user authentication.
-   **`/src`**: Contains the frontend application built with React and Vite. It includes all the UI components, pages, and client-side logic.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### Server Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Create a `.env` file in the `server` directory and add the following environment variables:**
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

5.  **Start the server:**
    ```bash
    npm start
    ```

### Client Installation

1.  **Navigate to the root directory of the project.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file in the root directory and add your Supabase configuration:**
    ```
    VITE_GEMINI_API_KEY=<your_gemini_api>
    VITE_API_URL=<your_api_url>
    VITE_WS_URL=<your_ws_url>
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.

## Available Scripts

### Root Directory

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the source code.
-   `npm run preview`: Previews the production build.

### Server Directory

-   `npm start`: Starts the Node.js server.
-   `npm run monitor`: Runs the monitoring script.
-   `npm run add-admin`: Runs a script to add a new admin user.

## Deployment

To deploy SenseHarvest, you will need to deploy the frontend and backend applications separately.

-   **Backend**: The `server` directory can be deployed to any platform that supports Node.js applications, such as Heroku, AWS, or a DigitalOcean Droplet.
-   **Frontend**: The `src` directory can be built using `npm run build` and the resulting `dist` folder can be deployed to any static hosting provider like Netlify, Vercel, or GitHub Pages.

Make sure to configure the environment variables on your deployment platforms accordingly.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue on the GitHub repository.

If you would like to contribute code, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with a descriptive message.
4.  Push your changes to your forked repository.
5.  Open a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
