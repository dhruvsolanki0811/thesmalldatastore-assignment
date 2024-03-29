import { Route, Routes } from "react-router-dom";
import { ErrorPage, HomePage } from "./pages/pages";

function RoutesPath() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
      </Routes>
    </>
  );
}

export default RoutesPath;
