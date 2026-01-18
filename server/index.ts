import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/user.js";
import streamRoutes from "./routes/stream.js";
import taskRoutes from "./routes/task.js";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Socket.io
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (_, res) =>
  res.json({
    message: "Welcome to the Mock API Server",
  })
);

httpServer.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
});
