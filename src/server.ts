import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.listen(process.env.PORT as string, () => console.log(`Listening on ${process.env.PORT}`));