import { Modal, Button } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { fetchUrl, formatDatePT } from "../utils";

interface Exam {
    _id: string,
    owner: string,
    name: string,
    date: Date,
    type: {_id: string, name: string},
    file: File | null,
    results: { selectedName: string, resultValue: string, selectedMeasure: string }[]
}

export const ExamItem: React.FC<{info: Exam, onDelete: () => void}> = ({info, onDelete}) => {
    const date = new Date(info.date);

    const formattedDate = formatDatePT(date);

    const [openModal, setOpenModal] = useState(false);

    const deleteExam = async (examId: string) => {
        try {
            await axios.delete(`${fetchUrl}/exams/${examId}`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });

            onDelete();

        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    }

    async function downloadFile(examId: string) {
        try {
            const response = await axios.get(`${fetchUrl}/exams/download/${examId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                },
                withCredentials: true,
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            const url = window.URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = url;
            a.download = `${info.type.name}-${formatDatePT(new Date(info.date))}.pdf`;
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
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                <div className="text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Você tem certeza que quer excluir esse exame?
                    </h3>
                    <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={() => {setOpenModal(false), deleteExam(info._id)}}>
                        {"Excluir"}
                    </Button>
                    <Button color="blue" onClick={() => setOpenModal(false)}>
                        Cancelar
                    </Button>
                    </div>
                </div>  
                </Modal.Body>
            </Modal>
            
            <div className="text-center max-w-sm py-8 px-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">{info.type.name}</h5>
                <h5 className="text-sm italic text-gray-900 h-6">{info.name && info.name}</h5>
                <h6 className="text-sm">{formattedDate}</h6>

                <div className="flex justify-center mt-6 gap-4">
                    <a href={`/results/${info._id}`} className="w-1/2 items-center px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                        Resultados
                    </a>
                    
                    <div>
                        <button type="button" onClick={() => downloadFile(info._id)} disabled={info.file ? false : true} className={`${info.file ? '' : 'opacity-50 cursor-not-allowed'} text-white float-end bg-green-500 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-4 text-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <button type="button" onClick={() => setOpenModal(true)} className={`text-white float-end bg-red-500 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-4 text-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}