import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import searchRoutes from "./routes/search.route.js";
import csvRoutes from "./routes/csv.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import helmet from "helmet";
dotenv.config();
console.log("Loaded Admin Emails:", process.env.ADMIN_EMAIL);

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")),
};

const httpServer = createServer(app,httpsOptions);
initializeSocket(httpServer);

app.use(
  cors({
    origin: "https://localhost",
    credentials: true,
  })
);

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB  max file size
    },
  })
);

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://localhost https://sandbox-buy.paddle.com;"
  );
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/subscription", subscriptionRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

httpServer.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
