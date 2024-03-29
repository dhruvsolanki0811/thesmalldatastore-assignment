import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/components"
import { useEffect, useState } from "react";

function ErrorPage() {
    const navigate = useNavigate();
    const [counter, setCounter] = useState<number>(10);
    useEffect(() => {
        const timer = counter > 0 && setTimeout(() =>setCounter(count=>count-1), 1000);
        if(counter===0){
            navigate("/")
        }
        return ()=>clearTimeout(timer as number)
      }, [counter]);

  return (
    <>
    <Navbar/>

          <div className="error-section flex flex-col items-center justify-center h-full" >
          <h1 className="error-header text-xl">404  Error</h1>
            <p className="error-desc">
            There is no such page you requested exists!
             </p>
          <span className="txt-md lt-bold count-txt">Back in {counter}</span>
          <button onClick={()=>navigate("/")} className="border-black border-[1px] border-solid  ps-2 pe-2 mt-4 hover:bg-black hover:text-white">Home</button>
          </div>
          
    </>
  )
}

export default ErrorPage