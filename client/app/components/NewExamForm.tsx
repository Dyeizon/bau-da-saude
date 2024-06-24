import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { fetchUrl, CSS } from "../utils";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ptBR", ptBR);

interface ExamType {
  _id: string;
  name: string;
  resultTypeIds?: string[]; // IDs dos tipos de resultado associados
}

interface ResultType {
  _id: string;
  name: string;
  measure: string; // Unidade de medida do resultado
}

export const NewExamForm = () => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);
  const [filteredResultTypes, setFilteredResultTypes] = useState<ResultType[]>([]);
  const [examType, setExamType] = useState<string>("");
  const [inputs, setInputs] = useState<{ selectedName: string; resultValue: string; selectedMeasure: string }[]>([{ selectedName: "", resultValue: "", selectedMeasure: "" }]);
  const [showResultSection, setShowResultSection] = useState(false);
  
  const [examDate, setExamDate] = useState(new Date());
  const [examName, setExamName] = useState("");

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await axios.get<ExamType[]>(`${fetchUrl}/types`);
        console.log("Tipos de Exame:", response.data);
        setExamTypes(response.data); // Atualiza os tipos de exame
      } catch (error) {
        console.error("Erro ao buscar os tipos de exame:", error);
      }
    };

    const fetchResultTypes = async () => {
      try {
        const response = await axios.get<ResultType[]>(`${fetchUrl}/result-types`);
        console.log("Tipos de Resultado:", response.data);
        setResultTypes(response.data); // Atualiza os tipos de resultado
      } catch (error) {
        console.error("Erro ao buscar os tipos de resultado:", error);
      }
    };

    fetchExamTypes();
    fetchResultTypes();
  }, []);

  const handleExamTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeId = event.target.value;
    console.log("ID do Tipo de Exame Selecionado:", selectedTypeId);
    setExamType(selectedTypeId);

    const selectedExam = examTypes.find((exam) => exam._id === selectedTypeId);
    console.log("Tipo de Exame Selecionado (Objeto):", selectedExam);

    if (selectedExam?.resultTypeIds && selectedExam.resultTypeIds.length > 0) {
      const resultTypeIds = selectedExam.resultTypeIds.map(String);

      const availableResults = resultTypes.filter((result) => resultTypeIds.includes(result._id));
      console.log("Tipos de Resultado Disponíveis:", availableResults);
      setFilteredResultTypes(availableResults);
      setInputs([{ selectedName: "", resultValue: "", selectedMeasure: "" }]);
      setShowResultSection(true);
    } else {
      console.log("Não há IDs de Tipos de Resultado para o Tipo de Exame Selecionado.");
      setFilteredResultTypes([]);
      setInputs([{ selectedName: "", resultValue: "", selectedMeasure: "" }]);
      setShowResultSection(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Inputs:", inputs);
    // Aqui você pode enviar os dados para o backend ou fazer outras operações
  };

  const addNewInputSet = () => {
    setInputs([...inputs, { selectedName: "", resultValue: "", selectedMeasure: "" }]);
  };

  const handleDelete = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  return (
    <div className="border border-gray-300 rounded-lg rounded-tr-none rounded-tl-none shadow">
      <form onSubmit={handleSubmit} className="mx-10 py-8">
        <fieldset>
          <legend className="mb-5">Informações do exame</legend>
          <div className="grid md:grid-cols-3 md:gap-5">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                id="name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Nome/Rótulo
              </label>
            </div>

            <div className="date-div relative z-10 w-full mb-5 group">
              <label htmlFor="date-picker" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Data do exame
              </label>
              <DatePicker
                highlightDates={[new Date()]}
                id="date-picker"
                className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
                dateFormat={'P'}
                locale="ptBR"
                selected={examDate}
                onChange={(date: Date) => setExamDate(date)}
              />
            </div>

            <div className="w-full mb-5 group">
              <select
                required
                id="type"
                value={examType}
                onChange={handleExamTypeChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Selecione o tipo de exame</option>
                {examTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {showResultSection && (
          <fieldset>
            <legend className="mb-5">Resultados</legend>
            <div>
                {inputs.map((input, index) => (
                    <div className="flex gap-6" key={index}>
                        <div className="relative z-0 w-full mb-5 group">
                          <select
                            required
                            id={`result-type-${index}`}
                            value={input.selectedName}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(event) => {
                              const newInputs = [...inputs];
                              const selectedResult = filteredResultTypes.find(result => result.name === event.target.value);
                              if (selectedResult) {
                                newInputs[index].selectedName = selectedResult.name;
                                newInputs[index].selectedMeasure = selectedResult.measure;
                              } else {
                                newInputs[index].selectedName = "";
                                newInputs[index].selectedMeasure = "";
                              }
                              setInputs(newInputs);
                            }}
                          >
                            <option value="">Selecione um resultado</option>
                            {filteredResultTypes.map((result) => (
                              <option key={result._id} value={result.name}>
                                {result.name}
                              </option>
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
        )}

        <button type="submit" className={`mt-5 text-white ${CSS.navBgColor} ${CSS.bgColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm !w-full sm:w-auto px-5 py-2.5 text-center `}>Cadastrar exame</button>
      </form>
    </div>
  );
};