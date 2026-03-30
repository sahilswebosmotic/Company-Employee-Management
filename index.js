import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log(error);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});