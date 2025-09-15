import express from 'express'
import { createUser, getSpecificUser } from '../lib/supabase.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login',async(req,res) => {
    try {
        const user = await getSpecificUser(req.body.username)
        if(!user.length){
            return res.status(403).json({ msg: "User not exist" });
        }
        const passwordMatch = await bcrypt.compare(req.body.password,user[0].password)
        if(!passwordMatch){
            return res.status(403).json({ msg: "the password not match" });
        }
        const token = jwt.sign({ username: req.body.username },process.env.SECRETE_KEY,{expiresIn:'7h'})
        res.json({token:token})
    } catch (error) {
        res.status(500).json({ msg: `server internal error: ${err}` });
    }
})

router.post('/signin',async(req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,12)
        req.body.password = hashedPassword
        createUser(req.body)
        const token = jwt.sign({ username: req.body.username },process.env.SECRETE_KEY,{expiresIn:'7h'})
        res.json({token:token})
    } catch (error) {
        res.status(500).json({ msg: `server internal error: ${err}` });
    }
})

router.get('/checkToken',async(req,res) => {
   try {
    console.log(req.headers)
    const token = req.headers['authorization'].split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    res.json(decoded);
  } catch (err) {
    res.status(400).json({ msg: `server internal error: ${err}` });
  }
})

export default router