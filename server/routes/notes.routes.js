import express from "express";
import connectDB from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const connection = await connectDB();
    try {
        const result = await connection.execute("SELECT * FROM notes");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: "error fetching notes"});
    } finally {
        await connection.close();
    }
})

router.post('/new', async (req, res) => {
    const connection = await connectDB();
    const {title, content} = req.body;

    try{
        await connection.execute(
            "INSERT INTO notes (title, content) VALUES (:title, :content)",
            [title, content],
            {autoCommit: true}
            );
            res.status(200).json({message: "Note created successfully"});
            
    } catch (err) {
        res.status(500).json({error: `Error creating note ${err}`});
    } finally {
        await connection.close();
    }
});

router.put('/:id', async (req, res) => {
    const {title, content} = req.body;
    const {id} = req.params;

    const connection = await connectDB();

    try {
        await connection.execute(
            "UPDATE notes SET title = :title, content = :content WHERE id = :id",
            [title, content, id],
            {autoCommit: true}
        );
    } catch (err) {
        res.status(500).json({ error: `Error updating note ${err}` });
    } finally {
        await connection.close();
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const connection = await connectDB();
    try {
        await connection.execute(
            "DELETE FROM notes WHERE id = :id",
            [id],
            { autoCommit: true }
        );
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: `Error deleting note ${err}` });
    } finally {
        await connection.close();
    }
});

export default router;