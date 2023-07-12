/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import Data from "./components/Data"
// import UrlForm from './components/Form';
import "./App.css";
import Loader from "./components/Loader";




interface Website {
  url: string;
  screenshot: string;
  wordCount: number;
}
interface ApiResponse{
  websites:Website[]
}

const App = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<Website[]>([]);
  const [loading,setLoading] = useState(false);


  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setData([]);
    setLoading(true);
    
    // Check if the URL starts with "https://"
    const validatedUrl = url.startsWith("https://") ? url : `https://${url}`;

    try{
      
    const response:AxiosResponse<ApiResponse> = await axios.post("https://website-analyzer.onrender.com/api/analyze", {
      url:validatedUrl,
    });
    
    setData(response.data.websites);
    
  }catch(err){
    console.log(err)
    alert('Enter a valid URL');
    
   
  }finally{
    setLoading(false);
  }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-lg">
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <label htmlFor="url" className="text-xl font-bold mb-4">
        URL:
      </label>
      <input
        type="text"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
    {loading ? (
      <div className="flex items-center justify-center mb-8">
        <Loader />
      </div>
    ) : (
      <Data data={data} />
    )}
    
  </div>
  );
};

export default App;
