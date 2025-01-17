const express = require("express");
const cors = require("cors");
const router = require("./router/route");
const server = express();

const allowedOrigins = [
  // 'https://mariage-experts.vercel.app',
  // 'https://mariage-experts-agents.vercel.app',
  // 'https://mariage-experts-admin.vercel.app',
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://192.168.18.143:3000",
  "http://192.168.18.143:3001",
  "http://192.168.18.143:3002",
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "x-api-key",
      "x-auth-token",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

require("dotenv").config({ path: "./config.env" });
require("./database/connection");

server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

server.use("/api/auth/", router);

server.get("/", (req, res) => {
  res.status(200).send("👋Welcome to MariageExperts Server");
});

const Port = process.env.PORT;
server.listen(Port, () => {
  console.log(
    `🖥️  ===================== Server Initiated at Port# ${Port} ===================== 🖥️`
  );
});
