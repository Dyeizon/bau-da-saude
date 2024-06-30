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
    type: { _id: string, name: string },
    file: File | null,
    results: { selectedName: string, resultValue: string, selectedMeasure: string }[]
}

export const MyExams: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<boolean>(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchExams = async () => {
        try {
            setIsFetching(true);
            const response = await fetch(`${fetchUrl}/exams/owner/${getTokenID(localStorage.getItem('token')?.split(' ')[1])}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                credentials: 'include'
            });

            if (response.status === 200) {
                const data = await response.json();
                setExams(data);
                if (data.length > 0) {
                    const id = getTokenID(localStorage.getItem('token')?.split(' ')[1]);
                    
                    try {
                        const response = await fetch(`${fetchUrl}/users/dates/${id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${localStorage.getItem('token')}`
                            },
                            credentials: 'include'
                        });
                
                        if (response.ok) {
                            const userData = await response.json();
                
                            if (userData.exists) {
                                const createdAt = new Date(userData.createdAt);
                                const notificatedAt = userData.notificatedAt ? new Date(userData.notificatedAt) : null;
                                const email = userData.email;

                                const currentDate = new Date();
                                const differenceInTime = currentDate.getTime() - createdAt.getTime();
                                const differenceInDays = differenceInTime / (1000 * 3600 * 24);

                                if (differenceInDays > 7) {
                                    const latestExamDate = new Date(data[0].date);
                                    const sixMonthsLater = new Date(latestExamDate);
                                    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
            
                                    if (currentDate > sixMonthsLater) {
                                        console.log('Já se passaram mais de 6 meses desde o último exame');
                                        if (notificatedAt !== null) {
                                            console.log('Há um registro de notificação no banco de dados.');
                                            const sixMonthsLaterNotification = new Date(notificatedAt);
                                            sixMonthsLaterNotification.setMonth(sixMonthsLaterNotification.getMonth() + 6);
                                            if (currentDate > sixMonthsLaterNotification) {
                                                console.log('Faz mais de 6 meses da última notificação.');
                                                const notificationResponse = await fetch(`${fetchUrl}/users/notificate`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                    },
                                                    body: JSON.stringify({ email }),
                                                    credentials: 'include'
                                                });

                                                if (notificationResponse.ok) {
                                                    console.log("Sucesso no envio da notificação!");
                                                } else {
                                                    console.log("Erro ao enviar a notificação!");
                                                }
                                            }
                                            else{
                                                console.log('Ainda não se passaram 6 meses da última notificação.');
                                            }
                                        }
                                        else{
                                            console.log('O usuário ainda não recebeu notificações.');
                                            const notificationResponse = await fetch(`${fetchUrl}/users/notificate`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `${localStorage.getItem('token')}`,
                                                },
                                                body: JSON.stringify({ email }),
                                                credentials: 'include'
                                            });

                                            if (notificationResponse.ok) {
                                                console.log("Sucesso no envio da notificação!");
                                            } else {
                                                console.log("Erro ao enviar a notificação!");
                                            }
                                        }
                                    } else {
                                        console.log('Ainda não se passaram 6 meses desde o último exame');
                                    }
                                } else {
                                    console.log(`Ainda não se passaram 7 dias do cadastro.`);
                                }
                            } else {
                                console.log('Usuário não encontrado');
                            }
                        } else if (response.status === 404) {
                            console.log('Usuário não encontrado');
                        } else {
                            console.log('Erro na requisição:', response.status);
                        }
                    } catch (error) {
                        console.error('Erro ao buscar dados do usuário:', error);
                    }
                }
            }
            setIsFetching(false);
        } catch (error) {
            console.log(error);
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
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                        </svg>
                    </button>
                </h2>
                <div id="accordion-newexam-body" className={`transition-all transform ${openAccordion ? 'h-full' : 'hidden h-0'}`} aria-labelledby="accordion-newexam-header">
                    <NewExamForm onSubmit={fetchExams} />
                </div>
            </div>

            <div className={`${isFetching ? 'opacity-80' : ''}`}>
                {exams && !isFetching && exams.length === 0 && (
                    <h1 className="text-center mt-10 px-10"><strong>Boas vindas.</strong><br />Assim que você cadastrar alguns exames, eles aparecerão aqui.</h1>
                )}

                <ExamsList>
                    <>
                        {exams.map(exam => (
                            <ExamItem onDelete={fetchExams} key={exam._id} info={exam} />
                        ))}
                    </>
                </ExamsList>
            </div>
        </div>
    );
}
