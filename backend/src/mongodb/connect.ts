import mongoose from 'mongoose'

const connectDB =(url?:string)=>{
   if(url!= undefined){
    mongoose.set('strictQuery',true);
    mongoose.connect(url)
    .then(() => console.log('connected to mongo'))
    .catch((err) => {
      console.error('failed to connect with mongo');
      console.error(err);
    });
  }
}
export default connectDB;