import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import drawRoutes from "./routes/drawRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/draw", drawRoutes);

app.listen(process.env.PORT as string, () => console.log(`Listening on ${process.env.PORT}`));