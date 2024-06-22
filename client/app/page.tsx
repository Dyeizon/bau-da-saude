'use client';

import {Navbar} from "@/app/components/Navbar";
import { useState } from "react";
import { MyExams } from "./components/MyExams";

import AuthBarrier from "./login/AuthBarrier";

const Home: React.FC = () => {
  const [currentTabElement, setCurrentTabElement] = useState(<MyExams/>);
  
  const handleDataFromNavbar = (navData: any) => {
    setCurrentTabElement(navData);
  }

  return (
    <AuthBarrier>
      <Navbar onData={handleDataFromNavbar}/>
      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        {currentTabElement && currentTabElement}
      </main>
    </AuthBarrier>
  );
}

export default Home;