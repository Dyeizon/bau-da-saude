import { CSS } from "../utils";
import { NewExamForm } from "./NewExamForm";
import { ExamsList } from "./ExamsList";
import { ExamItem } from "./ExamItem";
import { useState } from "react";

export const MyExams: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<boolean>(false);
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
                    <NewExamForm/>
                </div>
            </div>

            <ExamsList>
                <>
                    <ExamItem/>
                    <ExamItem/>
                    <ExamItem/>
                    <ExamItem/>
                    <ExamItem/>
                    <ExamItem/>
                </>
            </ExamsList>
        </div>
    );
}