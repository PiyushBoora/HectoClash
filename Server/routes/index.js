const express=require("express");
const router=express.Router();
const authRoutes=require("./auth")
const userRoutes=require("./user");

router.use("/api/user",userRoutes);
router.use("/api/auth",authRoutes);
module.exports=router;