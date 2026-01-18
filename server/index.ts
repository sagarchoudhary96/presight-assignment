import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import streamRoutes from "./routes/stream.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/stream", streamRoutes);

app.get("/", (_, res) =>
  res.json({
    message: "Welcome to the Mock API Server",
  })
);

app.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
});
