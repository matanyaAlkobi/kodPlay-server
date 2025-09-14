import express from "express";
import cors  from "cors"
import "dotenv/config"

const server = express();

server.use(cors({
  origin: [
    'http://localhost:5175',
    'http://localhost:5174', 
    'http://localhost:5173',
    'http://localhost:4545',
    'https://kodplay.netlify.app'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

server.use(express.json());


server.listen(process.env.SERVER_PORT || 4545, () => {
  console.log("server listening...");
});
