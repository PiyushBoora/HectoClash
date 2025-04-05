const express=require("express");
const router=express.Router();
const authRoutes=require("./auth")
const userRoutes=require("./user");
const duelRoutes=require("./duel")
const gameRoutes = require("./game");

router.use("/api/user",userRoutes);
router.use("/api/auth",authRoutes);
router.use("/api/duel",duelRoutes);
router.use("/api/game", gameRoutes);

module.exports=router;

