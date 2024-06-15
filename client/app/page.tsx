'use client';

import {Navbar} from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { MyExams } from "./components/MyExams";

import AuthBarrier from "./login/AuthBarrier";
import { fetchUrl } from "./utils";


const Home: React.FC = () => {
  const [currentTabElement, setCurrentTabElement] = useState(<MyExams/>);
  
  const handleDataFromNavbar = (navData: any) => {
    setCurrentTabElement(navData);
  }

  const test = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${fetchUrl}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token ? `${token}`: ''}`,
        },
        credentials: 'include'
      });

      if(!response.ok) {
        throw new Error(`Error <${response.status}>`)
      }

      const data = await response.json();
      console.log(data)

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    test();
  }, [])

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