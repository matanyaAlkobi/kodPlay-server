import { Router } from "express";
import { getfromSpotify, getlinkSpotify, token } from "../controller/link.js";

const routerSpotify = Router();

routerSpotify.get('/link',getlinkSpotify)
routerSpotify.get('/callback',token)
routerSpotify.get("/search/:type/:query", getfromSpotify);


export default routerSpotify;