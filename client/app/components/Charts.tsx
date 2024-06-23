import { useMemo, useState } from "react"
import { AxisOptions, Chart } from "react-charts"
import DatePicker, { registerLocale } from 'react-datepicker';
import {ptBR} from 'date-fns/locale/pt-BR';
registerLocale("ptBR", ptBR);

import "react-datepicker/dist/react-datepicker.css";

type MyDatum = { date: string, stars: number }

export const Charts: React.FC = () => {
    const [selectFilterType, setSelectFilterType] = useState<string>("result");
    const [selectFilterResult, setSelectFilterResult] = useState<string>("");
    const [useDate, setUseDate] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

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

            {selectFilterType === "result" ? 
            <fieldset>
                <div>
                    <div className="w-full mb-5 group">
                        <label htmlFor="resultType">Tipo de resultado</label>
                        <select id="resultType" onChange={e => setSelectFilterResult(e.currentTarget.value)} value={selectFilterResult} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="lactobacilos">Lactobacilos</option>
                            <option value="triglicerideos">Triglicerídeos</option>
                        </select>
                    </div>   
                </div>
            </fieldset>
            : 
            <fieldset>
                <div className="grid md:grid-cols-3 md:gap-5">
                    <div className="w-full mb-5 group">
                        <label htmlFor="resultType">Tipo de resultado</label>
                        <select id="resultType" onChange={e => setSelectFilterResult(e.currentTarget.value)} value={selectFilterResult} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="lactobacilos">Lactobacilos</option>
                            <option value="triglicerideos">Triglicerídeos</option>
                        </select>
                    </div>

                    <div className="date-div relative z-10 w-full mb-5 group">
                        <label htmlFor="date-picker-start">Data inicial</label>
                        <DatePicker highlightDates={[new Date()]} id="date-picker-start" className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full" dateFormat={'P'} locale="ptBR" selected={startDate} onChange={(date:any) => setStartDate(date)} />
                    </div>

                    <div className="date-div relative z-10 w-full mb-5 group">
                        <label htmlFor="date-picker-end">Data final</label>
                        <DatePicker highlightDates={[new Date()]} id="date-picker-end" className="py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full" placeholderText="oi" dateFormat={'P'} locale="ptBR" selected={endDate} onChange={(date:any) => setEndDate(date)} />
                    </div>       
                </div>
            </fieldset>
            }

            
            
            <div className="h-96 mt-8">
                <Chart options={{data, primaryAxis, secondaryAxes}}/>
            </div>
        </>
    );
}