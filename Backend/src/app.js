import express from "express"
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import router from "./routes/user.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use("/api/v1/users", router);

export default app;