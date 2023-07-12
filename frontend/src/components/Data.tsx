
interface Website {
    url: string;
    screenshot: string;
    wordCount: number;
  }
interface DataProp {
   data: Website[]
}  
const Data :React.FC<DataProp>=({data})=> {
    
    return (
        <div className="flex flex-wrap justify-center">
        {data.length > 0 &&
          data.map((item: Website) => (
            <div
              key={item.url}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4 mb-4"
            >
              <div className=" bg-white rounded-lg shadow-md p-6 h-full">
                <a href={item.url} target="_blank" className="text-xl font-bold mb-4">
                  Click Here
                </a>
                <img
                  src={item.screenshot}
                  alt="screenshot"
                  className="w-full h-auto mb-4"
                />
                <p>Word Count: {item.wordCount}</p>
              </div>
            </div>
          ))}
      </div>
  
    )
}
export default Data;