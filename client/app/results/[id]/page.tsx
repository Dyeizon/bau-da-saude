"use client";

import { NavbarGuest } from '@/app/components/NavbarGuest';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchUrl, formatDatePT } from '@/app/utils';

interface Exam {
  _id: string,
  owner: {name: string},
  name: string,
  date: Date,
  type: { name: string },
  file: File | null,
  results: { selectedName: string, resultValue: string, selectedMeasure: string }[]
}

const ExamPage = () => {  
  const params = useParams();
  const { id } = params;

  const [examData, setExamData] = useState<Exam>();

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${fetchUrl}/exams/${id}`, {
          headers: {
              Authorization: `${localStorage.getItem('token')}`
          }
      });

      console.log(response.data);
      setExamData(response.data);

    } catch (error) {
        console.error('Error fetching exam results:', error);
    }
  }

  useEffect(() => {
    fetchResults();
  }, []);

  async function downloadFile(examId: string) {
    if(!examData) return;
    try {
        const response = await axios.get(`${fetchUrl}/exams/download/${examId}`, {
            responseType: 'blob',
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${examData.type.name}-${examData.date}.pdf`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}


  return (
    <>
        <NavbarGuest/>
        <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          {examData && (
            <>
            <div className='text-center'>
              <div>
                <h1 className='text-2xl inline-block font-bold'>{examData.type.name}</h1>
                {examData.name && (
                    <h2 className='text-sm inline-block ml-2'>({examData.name})</h2>
                  )}
              </div>
              {formatDatePT(new Date(examData.date))}
              {examData.owner.name}
            </div>

            <div>
                <button type="button" onClick={() => downloadFile(examData._id)} disabled={examData.file ? false : true} className={`${examData.file ? '' : 'opacity-50 cursor-not-allowed'} flex gap-3 text-white float-end bg-green-500 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-4 px-4 my-4 text-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Fazer o download do exame
                </button>
            </div>

                  <h1 className='text-center text-xl my-2'>Resultados</h1>

            <table className="table-auto m-auto w-3/4 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {examData.results.map(result => (
                  <tr>
                    <td className="border px-4 py-2">{result.selectedName}</td>
                    <td className="border px-4 py-2">{result.resultValue}<span className='text-sm'>{result.selectedMeasure}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>

            </>
          )}
        </main>
    </>
  );
};

export default ExamPage;