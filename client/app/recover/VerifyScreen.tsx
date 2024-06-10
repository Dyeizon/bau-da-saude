import { useState, useRef } from "react";
const numberOfDigits = 4;

export default function VerifyScreen() {
    const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
    const [otpError, setOtpError] = useState<string | null>(null);
    const otpBoxReference = useRef<(HTMLInputElement | null)[]>([]);

    function handleChange(value: string, index: number) {
        const newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);

        if (value && index < numberOfDigits - 1) {
            otpBoxReference.current[index + 1]?.focus();
        }
    }

    function handleBackspaceAndEnter(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
            otpBoxReference.current[index - 1]?.focus();
        }
        if (e.key === "Enter" && e.currentTarget.value && index < numberOfDigits - 1) {
            otpBoxReference.current[index + 1]?.focus();
        }
    }

    return (
        <>
            <div className='flex items-center gap-4'>
                {otp.map((digit, index)=>(
                    <input key={index} value={digit} maxLength={1}  
                    onChange={(e)=> handleChange(e.target.value, index)}
                    onKeyUp={(e)=> handleBackspaceAndEnter(e, index)}
                    ref={(reference) => (otpBoxReference.current[index] = reference)}
                    className={`border w-20 h-auto text-white p-3 rounded-md block bg-black focus:border-2 focus:outline-none appearance-none`}
                    />
                ))}

            </div>
            {/* <div className="text-center">
                <img className="mx-auto w-40" src="./bau.jpg" alt="logo" />
                <h3 className="mb-8 mt-1 pb-1 text-lg font-semibold">
                Código enviado!
                </h3>
            </div>
            
            <p className="mb-4 text-m text-center">
            Insira no campo abaixo o código enviado para seu e-mail.
            </p>
            <div>
                <form action="" method="post">
                    <div className="flex flex-col space-y-8">
                        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                        <div className="w-16 h-16 ">
                            <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50" type="number" min="0" max="9" name="" id=""/>
                        </div>
                        <div className="w-16 h-16 ">
                            <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50" type="number" min="0" max="9" name="" id=""/>
                        </div>
                        <div className="w-16 h-16 ">
                            <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50" type="number" min="0" max="9" name="" id=""/>
                        </div>
                        <div className="w-16 h-16 ">
                            <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50" type="number" min="0" max="9" name="" id=""/>
                        </div>
                        </div>

                        <div className="flex flex-col space-y-5">
                        <div>
                            <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 border-none text-white text-sm shadow-sm" style={{ background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)' }}>
                            Enviar
                            </button>
                        </div>

                        <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            <p>Não recebeu o código?</p> <a className="flex flex-row items-center text-green-900" href="http://" target="_blank" rel="noopener noreferrer">Reenviar</a>
                        </div>
                        </div>
                    </div>
                </form>
            </div> */}
        </>
    );
}