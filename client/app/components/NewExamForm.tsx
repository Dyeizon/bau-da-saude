import { useState } from "react";
import DatePicker, { registerLocale } from 'react-datepicker';
import {ptBR} from 'date-fns/locale/pt-BR';
registerLocale("ptBR", ptBR);

import "react-datepicker/dist/react-datepicker.css";
import { CSS } from "../utils";

export const NewExamForm = () => {
    const [examDate, setExamDate] = useState(new Date());
    const [examName, setExamName] = useState("");
    const [examType, setExamType] = useState("");

    var possibleResults: Array<{name: string, measure: string}> = [
        {name: "Hemoglobina", measure: "g/dL"}, 
        {name: "Hematócrito", measure: "%"},
        {name: "Leucócitos", measure: "células/µL" },
        {name: "Contagem de Plaquetas", measure: "células/µL" }
    ];

    const [inputs, setInputs] = useState([{ selectedName: '', selectedMeasure: '', resultValue: '' }]);

    const handleSelectChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newInputs = [...inputs];
        const selectedOption = possibleResults.find(result => result.name === event.target.value);
        if (selectedOption) {
            newInputs[index].selectedName = selectedOption.name;
            newInputs[index].selectedMeasure = selectedOption.measure;
        } else {
            newInputs[index].selectedName = '';
            newInputs[index].selectedMeasure = '';
        }
        setInputs(newInputs);
    };

    const handleDelete = (index: number) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
    };

    const addNewInputSet = () => {
        setInputs([...inputs, { selectedName: '', selectedMeasure: '', resultValue: '' }]);
    };

    const getAvailableOptions = (currentIndex: number) => {
        const selectedNames = inputs.map(input => input.selectedName);
        return possibleResults.filter(result => !selectedNames.includes(result.name) || inputs[currentIndex].selectedName === result.name);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(inputs);
        
    }


    return (
        <div className="border border-gray-300 rounded-lg rounded-tr-none rounded-tl-none shadow">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto py-8">
                <fieldset>
                    <legend className="mb-5">Informações do exame</legend>
                    <div className="grid md:grid-cols-3 md:gap-5">
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" name="name" id="name" value={examName} onChange={e => setExamName(e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                            <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600
                             peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome/Rótulo</label>
                        </div>

                        <div className="date-div relative z-10 w-full mb-5 group">
                            <label htmlFor="date-picker" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Data do exame</label>
                            <DatePicker highlightDates={[new Date()]} id="date-picker" className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full" dateFormat={'P'} locale="ptBR" selected={examDate} onChange={(date:any) => setExamDate(date)} />
                        </div>

                        <div className="w-full mb-5 group">
                            <select required id="type" defaultValue="blood" value={examType} onChange={e => setExamType(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option value="blood">Exame de sangue</option>
                            </select>
                        </div>                  
                    </div> 
                </fieldset>
                
                <fieldset>
                    <legend className="mb-5">Resultados</legend>
                    <div>
                        {inputs.map((input, index) => (
                            <div className="flex gap-6" key={index}>
                                <div className="relative z-0 w-full mb-5 group">
                                <select 
                                    required 
                                    id={`result-type-${index}`} 
                                    value={input.selectedName || ''} 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    onChange={(event) => handleSelectChange(index, event)}
                                >
                                    <option value="">Selecione um resultado</option>
                                    {getAvailableOptions(index).map((result) => (
                                        <option key={result.name} value={result.name}>{result.name}</option>
                                    ))}
                                </select>
                                </div>
                                
                                <div className="relative z-0 w-full mb-5 group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="number" 
                                            step={0.001}
                                            min={0}
                                            max={10000}
                                            name={`result-value-${index}`} 
                                            id={`result-value-${index}`} 
                                            className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer pr-16" 
                                            placeholder=" " 
                                            required 
                                            value={input.resultValue}
                                            onChange={(e) => {
                                                const newInputs = [...inputs];
                                                newInputs[index].resultValue = e.target.value;
                                                setInputs(newInputs);
                                            }}
                                        />
                                        <label 
                                            htmlFor={`result-value-${index}`} 
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Valor
                                        </label>
                                        <span className="absolute right-2 text-gray-500">{input.selectedMeasure || ''}</span>
                                    </div>
                                </div>

                                
                                <div className="relative z-0 w-20 mb-5 group">
                                    {index === inputs.length - 1 ? (
                                        <button 
                                            type="button" 
                                            className="text-white float-end bg-blue-500 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-4 text-center"
                                            onClick={addNewInputSet}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button 
                                            type="button" 
                                            className="text-white float-end bg-red-500 w-full focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm py-2 px-4 text-center"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </fieldset>



                <button type="submit" className={`mt-5 text-white ${CSS.navBgColor} ${CSS.bgColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm !w-full sm:w-auto px-5 py-2.5 text-center `}>Cadastrar exame</button>
            </form>
        </div>
    );
}