import { useEffect, useState } from "react";
import Loader from "../components/FrontPage/Loader";
import BackgroundParticles from "../components/FrontPage/BackgroundParticles";
import splash from "../assets/images/FrontPage.png";

export default function FrontPage({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden 
                    bg-gradient-to-br from-black via-slate-900 to-black">

      {/* Floating Shapes Background */}
      <BackgroundParticles />

      {/* Splash & Loader */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">

        <img
          src={splash}
          className="w-180 mb-6 drop-shadow-[0_0_25px_#22d3ee] rounded-4xl"
        />

        <div className="bg-slate-900/60 backdrop-blur-md 
             px-6 py-4 rounded-xl border border-cyan-400/20 shadow-lg">

          <Loader progress={progress} />
        </div>

      </div>

    </div>
  );
}
