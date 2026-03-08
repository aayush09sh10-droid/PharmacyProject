import express from "express"

const app = express();
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Pharmacy app")
})

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log(`This App is running at ${PORT}`)
})