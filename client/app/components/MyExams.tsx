import { CSS } from "../utils";
import { NewExamForm } from "./NewExamForm";
import { ExamsList } from "./ExamsList";
import { ExamItem } from "./ExamItem";
import { useEffect, useState } from "react";
import { getTokenID } from "../utils";

import { fetchUrl } from "../utils";

interface Exam {
    _id: string,
    owner: string,
    name: string,
    date: Date,
    type: {_id: string, name: string},
    file: File | null,
    results: { selectedName: string, resultValue: string, selectedMeasure: string }[]
}

export const MyExams: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<boolean>(false);
    const [exams, setExams] = useState<Exam[]>([]);

    const fetchExams = async () => {
        const response = await fetch(`${fetchUrl}/exams/${getTokenID(localStorage.getItem('token')?.split(' ')[1])}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')?.split(' ')[1] ? `${localStorage.getItem('token')?.split(' ')[1]}`: ''}`,
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            setExams(data);
        }
    };  

    useEffect(() => {
        fetchExams();
    }, []);

    return (
        <div>
            <div id="accordion-collapse" data-accordion="collapse">
                <h2 id="accordion-newexam-header">
                    <button onClick={() => setOpenAccordion(!openAccordion)} type="button" className={`${CSS.bgColorCurrent} ${CSS.textColor} flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-700 border border-gray-300 ${openAccordion ? 'rounded-t-xl' : 'rounded-xl'} transition-all focus:ring-4 focus:ring-gray-200 gap-3`}>
                    <span>Cadastrar exame</span>
                    <svg data-accordion-icon className={`transition-all duration-500 w-3 h-3 ${openAccordion ? '' : 'rotate-180'} shrink-0`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                    </button>
                </h2>
                <div id="accordion-newexam-body" className={`transition-all transform ${openAccordion ? 'h-full' : 'hidden h-0'}`} aria-labelledby="accordion-newexam-header">
                    <NewExamForm onSubmit={fetchExams}/>
                </div>
            </div>

            <ExamsList>
                <>
                    {exams.map(exam => (
                        <ExamItem key={exam._id} info={exam}/>
                    ))}
                </>
            </ExamsList>
        </div>
    );
}