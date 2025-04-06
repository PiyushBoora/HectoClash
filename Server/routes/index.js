const express=require("express");
const router=express.Router();
const authRoutes=require("./auth")
const userRoutes=require("./user");
const duelRoutes=require("./duel")
const gameRoutes = require("./game");
const challengeRoutes = require("./challengeRoutes");

router.use("/api/user",userRoutes);
router.use("/api/auth",authRoutes);
router.use("/api/duel",duelRoutes);
router.use("/api/game", gameRoutes);
router.use("/api/challenge-game", challengeRoutes);
module.exports=router;

