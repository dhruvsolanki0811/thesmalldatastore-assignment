import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/pages";

function RoutesPath() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="*" element={<></>}></Route>
      </Routes>
    </>
  );
}

export default RoutesPath;
