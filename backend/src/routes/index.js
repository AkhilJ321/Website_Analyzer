"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webPage_1 = require("../controller/webPage");
const router = express_1.default.Router();
router.get("/analyze", webPage_1.getWordCount);
router.post("/analyze", webPage_1.analyzeUrl);
router.get("/screenshots", webPage_1.getScreenshots);
exports.default = router;
