import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./utils/webSocket";
import userRoutes from "./routes/user";
import streamRoutes from "./routes/stream";
import taskRoutes from "./routes/task";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

const io = initSocket(httpServer);

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
