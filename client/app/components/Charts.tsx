import { useEffect, useMemo, useState } from "react"
import { AxisOptions, Chart } from "react-charts"
import DatePicker, { registerLocale } from 'react-datepicker';
import {ptBR} from 'date-fns/locale/pt-BR';
registerLocale("ptBR", ptBR);

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { CSS, fetchUrl } from "../utils";

type MyDatum = { date: string, stars: number }

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

interface ChartData {

}

export const Charts: React.FC = () => {
    const [selectFilterType, setSelectFilterType] = useState<string>("result");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [examType, setExamType] = useState<string>("");
    const [examTypes, setExamTypes] = useState<ExamType[]>([]);

    const [resultType, setResultType] = useState<string>("");
    const [resultTypes, setResultTypes] = useState<ResultType[]>([]);
    const [filteredResultTypes, setFilteredResultTypes] = useState<ResultType[]>([]);

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [chartData, setChartData] = useState()

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

      const handleExamTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTypeId = event.target.value;
        setExamType(selectedTypeId);
    
        const selectedExam = examTypes.find((exam) => exam._id === selectedTypeId);
    
        if (selectedExam?.resultTypeIds && selectedExam.resultTypeIds.length > 0) {
          const resultTypeIds = selectedExam.resultTypeIds.map(String);
          const availableResults = resultTypes.filter((result) => resultTypeIds.includes(result._id));
          setFilteredResultTypes(availableResults);

        } else {
          setFilteredResultTypes([]);
        }
      };

      useEffect(() => {
        fetchExamTypes();
        fetchResultTypes();
      }, []);

      const generateChart = async () => {
        setIsLoading(true);
        setIsLoading(false);
      } 

    const data = [
    {
        label: 'Quantidade',
        data: [
        {
            date: "bananas",
            stars: 2,
        },
        {
            date: "maçãs",
            stars: 4,
        },
        {
            date: "mangas",
            stars: 12,
        },
        {
            date: "abacates",
            stars: 9,
        },
        ],
    },
    ]

    const primaryAxis = useMemo(
        (): AxisOptions<MyDatum> => ({
          getValue: datum => datum.date,          
        }),
        []
      )
    
      const secondaryAxes = useMemo(
        (): AxisOptions<MyDatum>[] => [
          {
            getValue: datum => datum.stars,
            elementType: 'area',
          },
        ],
        []
      )

    return (
        <>
            <fieldset>
            <div className="w-full mb-5 group">
                <label htmlFor="filterType">Filtrar por</label>
                <select id="filterType" onChange={e => setSelectFilterType(e.currentTarget.value)} value={selectFilterType} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="result" selected>Tipo de resultado</option>
                    <option value="result-and-date">Tipo de resultado e data</option>
                </select>
            </div>
            </fieldset>

            {console.log(filteredResultTypes)}

            <fieldset>
                <div className="grid md:grid-cols-2 md:gap-5">
                    <div>
                        <label htmlFor="examType">Tipo de exame</label>
                        <select
                            required
                            id="examType"
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

                    <div>
                    <label htmlFor="resultType">Tipo de resultado</label>
                    <select
                        required
                        id="type"
                        value={resultType}
                        onChange={(e) => setResultType(e.currentTarget.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="">Selecione o tipo de resultado</option>
                        {filteredResultTypes && filteredResultTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                            {type.name}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>

                {selectFilterType === "result-and-date" && (
                <div className="grid md:grid-cols-2 md:gap-5 mt-4">
                    <div className="date-div relative z-10 w-full mb-5 group">
                        <label htmlFor="date-picker-start">Data inicial</label>
                        <DatePicker showMonthDropdown showYearDropdown dropdownMode="select" highlightDates={[new Date()]} id="date-picker-start" className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full" dateFormat={'P'} locale="ptBR" selected={startDate} onChange={(date:any) => setStartDate(date)} />
                    </div>

                    <div className="date-div relative z-10 w-full mb-5 group">
                        <label htmlFor="date-picker-end">Data final</label>
                        <DatePicker showMonthDropdown showYearDropdown dropdownMode="select" highlightDates={[new Date()]} id="date-picker-end" className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full" placeholderText="oi" dateFormat={'P'} locale="ptBR" selected={endDate} onChange={(date:any) => setEndDate(date)} />
                    </div>       
                </div>
                )}
            </fieldset>

            <button type="button" onClick={generateChart} disabled={isLoading} className={`mt-4 text-white ${CSS.navBgColor} ${CSS.bgColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm !w-full sm:w-auto px-5 py-2.5 text-center `}>
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
                        Gerar gráfico
                    </>
                )}
          </button>

            
            
            <div className="h-96 mt-8">
                <Chart options={{data, primaryAxis, secondaryAxes}}/>
            </div>
        </>
    );
}