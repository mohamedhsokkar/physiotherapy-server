import express from 'express';
import dotenv from "dotenv";


import app from "./src/app.js";
import { connectLocalDB } from './src/config/db.js';


dotenv.config();
const PORT = process.env.PORT || 3007;

const startServer = async () => {
    await connectLocalDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();