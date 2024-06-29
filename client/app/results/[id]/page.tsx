"use client";

import { NavbarGuest } from '@/app/components/NavbarGuest';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { calculateAge, fetchUrl, formatDatePT } from '@/app/utils';

interface Exam {
  _id: string,
  owner: { name: string, birthDate: Date },
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
        a.download = `${examData.type.name}-${formatDatePT(new Date(examData.date))}.pdf`;
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
          <h1 className='text-center text-2xl my-4 font-semibold'>Resultados do exame</h1>
          {examData && (
            <>
            <table className="table-fixed m-auto w-3/4 text-center mb-4">
              <thead>
                <tr>
                  <td colSpan={2} className="border border-gray-400 bg-blue-400 px-4 py-2 font-semibold">Ficha</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Paciente</th>
                  <td className="border border-gray-400 px-4 py-2">{examData.owner.name}</td>
                </tr>

                <tr>
                  <th className="border border-gray-400 px-4 py-2">Data de nascimento</th>
                  <td className="border border-gray-400 px-4 py-2">{formatDatePT(new Date(examData.owner.birthDate))}</td>
                </tr>

                <tr>
                  <th className="border border-gray-400 px-4 py-2">Idade</th>
                  <td className="border border-gray-400 px-4 py-2">{calculateAge(examData.owner.birthDate, new Date())} anos</td>
                </tr>
              </tbody>
            </table>

                <table className="table-fixed m-auto w-3/4 text-center mb-8">
                  <tbody>
                {examData.name && (
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">Rótulo do exame</th>
                    <td className="border border-gray-400 px-4 py-2">{examData.name}</td>
                  </tr>
                )}

                <tr>
                  <th className="border border-gray-400 px-4 py-2">Tipo do exame</th>
                  <td className="border border-gray-400 px-4 py-2">{examData.type.name}</td>
                </tr>

                <tr>
                  <th className="border border-gray-400 px-4 py-2">Data do exame</th>
                  <td className="border border-gray-400 px-4 py-2">{formatDatePT(new Date(examData.date))}</td>
                </tr>

                <tr>
                  <th colSpan={2} className="border border-gray-400">
                    <div>
                      <button type="button" onClick={() => downloadFile(examData._id)} disabled={examData.file ? false : true} className={`${examData.file ? '' : 'opacity-50 cursor-not-allowed'} flex gap-3 text-white float-end bg-green-500 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm py-3 justify-center text-center`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                          Fazer o download do exame
                      </button>
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>

            {examData.results.length > 0 && (
              <table className="table-fixed m-auto w-3/4 text-center my-2">
                <thead>
                  <tr>
                    <td colSpan={2} className="border border-gray-400 bg-blue-400 px-4 py-2 font-semibold">Resultados</td>
                  </tr>
                </thead>
                <tbody>
                  {examData.results.map((result, index) => (
                    <tr key={`result-${index+1}`}>
                      <td className="border px-4 py-2 border-gray-400">{result.selectedName}</td>
                      <td className="border px-4 py-2 border-gray-400">{result.resultValue}<span className='text-sm'>{result.selectedMeasure}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}


            </>
          )}
        </main>
    </>
  );
};

export default ExamPage;