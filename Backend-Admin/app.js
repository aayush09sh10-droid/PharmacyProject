import express from "express"
import cors from "cors";
import morgan  from "morgan";
import cookieParser from "cookie-parser"



const app =express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,

}));
app.use(express.json({
    limit:"16kb"


}));
app.use(morgan("dev"));
app.get("/",(req,res)=>{
    res.send("Backend is running")
})
import router from "./src/routes/user.routes";

app.use("/api/v1/users",router)
export default app