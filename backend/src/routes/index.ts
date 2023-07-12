import express from "express";
import {getWordCount,analyzeUrl,getScreenshots} from "../controller/webPage"


const router = express.Router();

router.get("/analyze", getWordCount);
router.post("/analyze",analyzeUrl);
router.get("/screenshots",getScreenshots);

export default router;
