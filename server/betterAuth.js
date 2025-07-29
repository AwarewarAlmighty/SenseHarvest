import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { toNodeHandler } from "better-auth/node";
import { getConnection } from "./config/db.js";

function initializeAuth() {
    const dbConnection = getConnection();
    if (!dbConnection) {
        throw new Error("Database not connected. Call connectDB before creating auth instance.");
    }
    const usersCollection = dbConnection.collection('users');

    const auth = betterAuth({
        database: mongodbAdapter(usersCollection),
        secret: process.env.JWT_SECRET,
        baseURL: "http://localhost:3000",
    });

    return { auth, toNodeHandler };
}

export { initializeAuth };