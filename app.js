import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

// Boilerplate for Express
const app = express();
const PORT = 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(path.resolve(), "public")));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Boilerplate for sockets
const server = http.createServer(app);
const io = new Server(server); // Create a new instance of Server
let count = 0;

io.on("connection", (socket) => {
    console.log(`User ${count} Connected`);
    count++;

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data }); // Ensure the event name matches with the frontend
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        io.emit("disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
