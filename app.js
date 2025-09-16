import express from "express";
import cors  from "cors"
import "dotenv/config"
import router from "./routes/users.js";
import routerSpotify from "./routes/spotify.js";

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

server.use("/", (req, res, next) => {
  console.log(`method: ${req.method} url: ${req.url}`);
  next();
});

server.use(express.json());

server.use('/users',router)
server.use('/spotify',routerSpotify)


server.listen(process.env.SERVER_PORT || 4545, () => {
  console.log(`server listening on port:${process.env.SERVER_PORT}`);
});
