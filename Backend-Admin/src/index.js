import express from "express"
import connectDB from "./config/mongo.config.js";
import dotenv from "dotenv"
import app from "./app.js"
dotenv.config()
// const app = express();
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Pharmacy app")
})

const PORT = process.env.PORT || 9000;

// app.listen(PORT,()=>{
//     console.log(`This App is running at ${PORT}`)
// })
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running at localhost:${PORT}`)

    })
}).catch((err) => {
    console.log("DB connection error ", err);
});