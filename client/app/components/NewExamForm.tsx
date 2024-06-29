import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { fetchUrl, CSS } from "../utils";
import "react-datepicker/dist/react-datepicker.css";
import { getTokenID } from "../utils";

registerLocale("ptBR", ptBR);

interface ExamType {
  _id: string;
  name: string;
  resultTypeIds?: string[];
}

interface ResultType {
  _id: string;
  name: string;
  measure: string;
}

export const NewExamForm: React.FC<{onSubmit: () => void}> = ({ onSubmit }) => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);
  const [filteredResultTypes, setFilteredResultTypes] = useState<ResultType[]>([]);
  const [showResultSection, setShowResultSection] = useState(false);
  
  const [examName, setExamName] = useState<string>("");
  const [examDate, setExamDate] = useState(new Date());
  const [examType, setExamType] = useState<string>("");
  const [examFile, setExamFile] = useState<File | null>(null);
  const [inputs, setInputs] = useState<{ selectedName: string; resultValue: string; selectedMeasure: string }[]>([{ selectedName: "", resultValue: "", selectedMeasure: "" }]);
  
  const [hasFileError, setHasFileError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const owner = getTokenID(localStorage.getItem('token')?.split(' ')[1]);

  const resetFields = () => {
    setExamName("");
    setExamDate(new Date());
    setExamType("");
    setExamFile(null);
    setInputs([]);
    setShowResultSection(false);
  }

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await axios.get<ExamType[]>(`${fetchUrl}/types`, {withCredentials: true});
        setExamTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os tipos de exame:", error);
      }
    };

    const fetchResultTypes = async () => {
      try {
        const response = await axios.get<ResultType[]>(`${fetchUrl}/result-types`, {withCredentials: true});
        setResultTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os tipos de resultado:", error);
      }
    };

    fetchExamTypes();
    fetchResultTypes();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if(event.target.files?.[0] && event.target.files?.[0].size > 12000000) {
        setHasFileError(true);
        setIsLoading(false);
        setExamFile(null);
        return;
      }

      setExamFile(event.target.files?.[0] || null);
      setHasFileError(false);

  }

  const handleExamTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeId = event.target.value;
    setExamType(selectedTypeId);

    const selectedExam = examTypes.find((exam) => exam._id === selectedTypeId);

    if (selectedExam?.resultTypeIds && selectedExam.resultTypeIds.length > 0) {
      const resultTypeIds = selectedExam.resultTypeIds.map(String);
      const availableResults = resultTypes.filter((result) => resultTypeIds.includes(result._id));
      setFilteredResultTypes(availableResults);
      setInputs([{ selectedName: "", resultValue: "", selectedMeasure: "" }]);
      setShowResultSection(true);
    } else {
      setFilteredResultTypes([]);
      setInputs([{ selectedName: "", resultValue: "", selectedMeasure: "" }]);
      setShowResultSection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!examDate || !examType) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }

    if(hasFileError) {
      alert('O arquivo escolhido é muito grande.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('owner', owner);
    formData.append('examName', examName);
    formData.append('examDate', examDate.toISOString());
    formData.append('examType', examType);
    if(examFile) formData.append('examFile', examFile);
    formData.append('results', JSON.stringify(inputs));
  
    try {
      const response = await axios.post(`${fetchUrl}/exams`, formData, {withCredentials: true});
      if(response.status === 200) {
        resetFields();
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.error("Erro ao cadastrar exame:", error);
    } finally {
        onSubmit();
        setIsLoading(false);
    }
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
              <label htmlFor="date-picker" className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                <span className="text-red-900 font-bold">*</span><span className="text-sm">Data do exame</span> 
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

              
      <label htmlFor="exam_file">Enviar um arquivo</label>
      <input onChange={(e) => handleFileChange(e)} name="examFile" accept=".pdf" className={`${hasFileError ? 'bg-red-300' : ''} mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50`} id="exam_file" type="file"/>
      <p className={`${hasFileError ? 'text-red-700 font-bold' : ''} mt-1 mb-5 text-sm text-gray-500`} id="exam_file_help">Apenas PDF com tamanho máximo de 12MB</p>

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

        <button type="submit" disabled={isLoading} className={`mt-5 text-white ${CSS.navBgColor} ${CSS.bgColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm !w-full sm:w-auto px-5 py-2.5 text-center `}>
        {isLoading ? (
            <>
                <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                Carregando...
            </>
        ) : (
            <>
                Cadastrar exame
            </>
        )}
          </button>
      </form>
    </div>
  );
};