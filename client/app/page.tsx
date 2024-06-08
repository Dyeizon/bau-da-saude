'use client';

import {Navbar} from "@/app/components/Navbar";
import { useState } from "react";
import { MyExams } from "./components/MyExams";

export const CSS = {navBgColor: 'bg-green-700', bgColorCurrent: 'bg-green-600', bgColorHover: 'hover:bg-green-600', textColor: 'text-white'};

export default function Home() {
  const [currentTabElement, setCurrentTabElement] = useState(<MyExams/>);
  
  const handleDataFromNavbar = (navData: any) => {
    setCurrentTabElement(navData);
  }

  return (
    <>
      <Navbar onData={handleDataFromNavbar}/>
      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        {currentTabElement && currentTabElement}
      </main>
    </>
  );
}