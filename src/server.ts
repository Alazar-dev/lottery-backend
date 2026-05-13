import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import drawRoutes from "./routes/drawRoutes";
import adminRoutes from "./routes/adminRoutes";

import {startWeeklyDrawJob} from "./jobs/drawJob";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://lottery-client-mocha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/admin", adminRoutes);

const PORT = Number(process.env.PORT) || 10000;
const HOST = "0.0.0.0";

async function bootstrap() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    startWeeklyDrawJob();

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

bootstrap();
