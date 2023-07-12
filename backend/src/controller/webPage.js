"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenshots = exports.analyzeUrl = exports.getWordCount = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const string_strip_html_1 = require("string-strip-html");
const cloudinary_1 = require("cloudinary");
const screenShot_1 = require("../mongodb/models/screenShot");
cloudinary_1.v2.config({
    cloud_name: 'dwmdlzkoy',
    api_key: '986435993554499',
    api_secret: 'Z0-QXBPKSKWDfWEcXeDY0rfu6Sk'
});
const getWordCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    try {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto(url);
        // Get the HTML content from the page
        const htmlContent = yield page.content();
        // Strip HTML tags and get the readable content
        const strippedContent = (0, string_strip_html_1.stripHtml)(htmlContent).result.trim();
        // Count the total number of words
        const words = strippedContent
            .split(/\s+/)
            .filter((word) => word.length > 0);
        const wordCount = words.length;
        yield browser.close();
        res.json({ wordCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});
exports.getWordCount = getWordCount;
const analyzeUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    try {
        const browser = yield puppeteer_1.default.launch({
            args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote",],
            executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer_1.default.executablePath()
        });
        const page = yield browser.newPage();
        yield page.goto(url);
        yield page.waitForSelector("a");
        const links = yield page.$$eval("a", (elements) => {
            return elements.map((el) => el.getAttribute("href"));
        });
        const internalLinks = links
            .filter((link) => link !== null && (link.startsWith("/") || link.startsWith(url)))
            .slice(0, 3);
        const websites = [];
        for (const link of internalLinks) {
            const page = yield browser.newPage();
            const fullLink = (link === null || link === void 0 ? void 0 : link.startsWith("/")) ? `${url}${link}` : link;
            yield page.goto(fullLink);
            // Get the HTML content from the page
            const htmlContent = yield page.content();
            // Strip HTML tags and get the readable content
            const strippedContent = (0, string_strip_html_1.stripHtml)(htmlContent).result.trim();
            // Count the total number of words
            const words = strippedContent
                .split(/\s+/)
                .filter((word) => word.length > 0);
            const wordCount = words.length;
            const screenshotBuffer = yield page.screenshot({ encoding: "binary" });
            // screenshots.push(screenshotPath);
            try {
                const uploadResult = yield new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                        folder: "screenshots"
                    }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    uploadStream.write(screenshotBuffer);
                    uploadStream.end();
                });
                const screenshotData = new screenShot_1.ScreenShotModel({
                    url: fullLink,
                    publicId: uploadResult.public_id,
                    photoUrl: uploadResult.url
                });
                yield screenshotData.save();
                websites.push({
                    url: fullLink,
                    screenshot: uploadResult.url,
                    wordCount: wordCount
                });
            }
            catch (err) {
                console.log(err);
            }
            yield page.close();
        }
        yield browser.close();
        res.json({ websites });
    }
    catch (err) {
        res.status(500).json({ error: "An error occurred" });
    }
});
exports.analyzeUrl = analyzeUrl;
const getScreenshots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const screenshots = yield screenShot_1.ScreenShotModel.find({}, "-_id url publicId");
        res.json({ screenshots });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});
exports.getScreenshots = getScreenshots;
