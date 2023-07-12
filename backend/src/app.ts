import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { stripHtml } from 'string-strip-html';
import connectDB from './mongodb/connect';
import morgan from "morgan";
import router from './routes';
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api",router);

app.get("/", (req: Request, res: Response) => {
    res.send({message:"Main Page Loaded"})
  });



  const startServer = async () => {
    try {
      connectDB(process.env.MONGODB_URL);
      app.listen(3000, () => console.log('Server started on port 3000'));
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();
