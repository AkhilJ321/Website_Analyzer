import { Schema,model } from "mongoose";

interface IScreenshot extends Document {
    url: string;
    publicId: string;
  }
  
  const ScreenShot = new Schema({
    url: String,
    publicId: String,
    photoUrl: String
  });

  const ScreenShotModel = model<IScreenshot>('ScreenShot',ScreenShot);

  export  {ScreenShotModel,IScreenshot};