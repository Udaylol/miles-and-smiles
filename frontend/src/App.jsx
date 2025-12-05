import { useState } from "react";
import FrontPage from "./Pages/FrontPage";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ? (
        <FrontPage onFinish={() => setLoaded(false)} />
      ) : (
        <div className="text-white text-3xl h-screen flex justify-center items-center">
          Home Page Here
        </div>
      )}
    </>
  );
}
