"use client";

import { NavbarGuest } from '@/app/components/NavbarGuest';
import { useParams } from 'next/navigation';

const ExamPage = () => {  
  const params = useParams();
  const { id } = params;

  return (
    <>
        <NavbarGuest/>
        <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <h1>Results Page</h1>
            <p>Exam ID: {id}</p>
        </main>
    </>
  );
};

export default ExamPage;