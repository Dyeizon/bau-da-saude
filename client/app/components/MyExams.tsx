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

                {isFetching && (
                    <div className="text-center">
                        <h1 className="mt-10 px-10 mb-5">Carregando exames...</h1>
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    
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
