import express, { type Application, type Request, type Response } from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

app.use(cors({
    origin: "http://localhost:5000",
}));

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Devpulse server is running!",
        author: "Aditta Chakraborty",
    });
});

export default app;
