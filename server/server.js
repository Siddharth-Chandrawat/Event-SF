import express from 'express'
import cors from 'cors'
import { initOraclePool } from "./db/db.js";
import authRoutes from "./routes/auth.js";
import { configDotenv } from 'dotenv';
configDotenv();

const PORT = process.env.PORT || 8001
const app = express();

app.use(
    cors({
      origin: "http://localhost:5173", // your Vite frontend
      credentials: true,
    })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

await initOraclePool(); // Initialize DB pool before setting up routes


app.listen(PORT, () => {
    console.log(`👾 Server is running on http://localhost:${PORT}`);    
})
