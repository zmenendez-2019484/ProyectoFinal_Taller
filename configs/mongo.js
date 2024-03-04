'use strict';
import mongoose, { mongo } from "mongoose";

export const dbConnection = async () => {
    try {
        mongoose.connection.on("open", () => {
            console.log("Database is connected");
        });
        mongoose.connection.on("error", (error) => {
            console.log("Error in the database connection", error);
            mongoose.disconnect();
        });
        mongoose.connection.on("disconnected", () => {
            console.log("Database is disconnected");
        });
        mongoose.connection.on("connected", () => {
            console.log("MongoDB is connected to the database");
        });
        mongoose.connection.on("reconnected", () => {
            console.log("Database is reconnected");
        });
        mongoose.connection.on("connecting", () => {
            console.log("Database is connecting");
        });
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    } catch (error) {
        console.log(error);
        throw new Error("Error in the database connection");
    }
}
