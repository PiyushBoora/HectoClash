const express=require("express");
const router=express.Router();
const authRoutes=require("./auth")
const userRoutes=require("./user");
const duelRoutes=require("./duel")
router.use("/api/user",userRoutes);
router.use("/api/auth",authRoutes);
router.use("/api/duel",duelRoutes);
module.exports=router;