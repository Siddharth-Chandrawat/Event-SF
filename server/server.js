import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv';
import connectDB from './db.js';
import notesRouter from './routes/notes.routes.js';
configDotenv();
const app = express();
const PORT = process.env.PORT || 8001

app.use(cors());

app.use(express.json());

app.get('/api/name', (req, res) => {
  res.json({name: "Samay", age:20});
})

app.get('/test-db', async (req, res) => {
    const connection = await connectDB();
    if(connection) {
        res.send("💪 Database connection successful...");
    }
    else {
        res.status(500).send("😵 Database connection failed...")
    }
})

app.listen(PORT, () => {
    console.log(`👾 Server is running on http://localhost:${PORT}`);
    
})
