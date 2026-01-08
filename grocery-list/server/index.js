console.log("SERVER FILE LOADED");

import express from "express";
import dotenv from "dotenv";
import { query } from "../db/index.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Grocery List API is running");
});

app.get("/api/items", async (req, res) => {
  try {
    const result = await query("SELECT * FROM items ORDER BY id;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/api/items", async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  try {
    const result = await query(
      `INSERT INTO items (name, category)
       VALUES ($1, $2)
       RETURNING *;`,
      [name, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
