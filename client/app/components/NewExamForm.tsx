import { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import {ptBR} from 'date-fns/locale/pt-BR';
registerLocale("ptBR", ptBR);
setDefaultLocale('ptBR');

import "react-datepicker/dist/react-datepicker.css";
import { CSS } from "../page";

export const NewExamForm = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        
        <div className="border border-gray-200 rounded-lg shadow">
            <form className="max-w-5xl mx-auto py-8">
                <fieldset>
                    <legend className="mb-5">Informações do exame</legend>
                    <div className="grid md:grid-cols-3 md:gap-5">
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                            <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600
                             peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome/Rótulo</label>
                        </div>

                        <div className="date-div relative z-0 w-full mb-5 group">
                            <label htmlFor="date-picker" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Data do exame</label>
                            <DatePicker id="date-picker" className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full" dateFormat={'P'} locale="ptBR" selected={startDate} onChange={(date:any) => setStartDate(date)} />
                        </div>

                        <div className="w-full mb-5 group">
                            <select required id="type" defaultValue="blood" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option value="blood">Exame de sangue</option>
                            </select>
                        </div>                  
                    </div> 
                </fieldset>

                
                <fieldset>
                    <legend className="mb-5">Resultados</legend>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <select required id="result-type-1" defaultValue="blood" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option value="triglicerideos">Triglicerídeos</option>
                            </select>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="number" name="result-value-1" id="result-value-1" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer" placeholder=" " required />
                            <label htmlFor="result-value-1" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Valor</label>
                        </div>
                    </div>

                    <button type="button" className={`text-white float-end ${CSS.bgColorCurrent} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-4 text-center inline-flex items-center`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </fieldset>



                <button type="submit" className={`mt-5 text-white ${CSS.navBgColor} ${CSS.bgColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm !w-full sm:w-auto px-5 py-2.5 text-center `}>Cadastrar exame</button>
            </form>
        </div>
    );
}