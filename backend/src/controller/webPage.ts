import { Request, Response } from "express";
import puppeteer,{ Browser, Page }  from "puppeteer";
import { stripHtml} from "string-strip-html";
import { v2 as cloudinary } from 'cloudinary';
import {ScreenShotModel,IScreenshot} from "../mongodb/models/screenShot";


cloudinary.config({ 
  cloud_name: 'dwmdlzkoy', 
  api_key: '986435993554499', 
  api_secret: 'Z0-QXBPKSKWDfWEcXeDY0rfu6Sk' 
});

 const getWordCount = async (req:Request, res:Response) => {
  const { url } = req.query;

  try {
    const browser:Browser = await puppeteer.launch();
    const page:Page = await browser.newPage();
    await page.goto(url as string);

    // Get the HTML content from the page
    const htmlContent:string = await page.content();

    // Strip HTML tags and get the readable content
    const strippedContent:string = stripHtml(htmlContent).result.trim();

    // Count the total number of words
    const words:string[] = strippedContent
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const wordCount:number = words.length;

    await browser.close();
    res.json({ wordCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

 const analyzeUrl = async (req:Request, res:Response):Promise<void> => {
  const { url } = req.body;
  
  try {
    const browser:Browser = await puppeteer.launch({
      args:["--disable-setuid-sandbox","--no-sandbox","--single-process","--no-zygote",],
      executablePath:process.env.NODE_ENV==='production'? process.env.PUPPETEER_EXECUTABLE_PATH :puppeteer.executablePath()
    });
    const page:Page = await browser.newPage();
    await page.goto(url);
   
    await page.waitForSelector("a");

    const links:(string|null)[] = await page.$$eval("a", (elements:HTMLAnchorElement[]):(string|null)[] => {
      return elements.map((el:HTMLAnchorElement) => el.getAttribute("href"));
    });
 

    const internalLinks:string[] = links
      .filter((link:string|null):link is string => link !== null && (link.startsWith("/") || link.startsWith(url as string)))
      .slice(0, 3);
     

      const websites: {
        url: string;
        screenshot: string;
        wordCount: number;
      }[] = [];

    for (const link of internalLinks) {
      const page: Page = await browser.newPage();
      const fullLink:string = link?.startsWith("/") ? `${url}${link}` : link;
    
      await page.goto(fullLink);
       // Get the HTML content from the page
    const htmlContent:string = await page.content();
    // Strip HTML tags and get the readable content
    const strippedContent:string = stripHtml(htmlContent).result.trim();
    // Count the total number of words
    const words:string[] = strippedContent
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const wordCount:number = words.length;


      const screenshotBuffer = await page.screenshot({encoding:"binary"}); 

      // screenshots.push(screenshotPath);
     try{
      const uploadResult:any = await new Promise((resolve,reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({
          folder:"screenshots"
        },(error,result)=>{
          if(error) reject(error);
          else resolve(result);
        })
        uploadStream.write(screenshotBuffer);
        uploadStream.end();
      })
  
      const screenshotData = new ScreenShotModel({
        url: fullLink,
        publicId: uploadResult.public_id,
        photoUrl:uploadResult.url
      });
      await screenshotData.save();
      
      websites.push({
        url: fullLink,
        screenshot: uploadResult.url,
        wordCount: wordCount
      });
    }catch(err){
      console.log(err);
    }
    await page.close();
    }

    await browser.close();

    res.json({websites});
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
};

 const getScreenshots = async(req:Request,res:Response):Promise<void> =>{
  try{
    const screenshots: IScreenshot[] = await ScreenShotModel.find({}, "-_id url publicId");

    res.json({ screenshots });
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
 }
export {getWordCount,analyzeUrl,getScreenshots}
