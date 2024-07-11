import { useState, useRef } from "react";
import { fetchUrl } from "../utils";
import ResetPassword from "./ResetPassword";

const numberOfDigits = 4;

export default function VerifyScreen({ email }: { email: string }) {
    const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
    const [otpError, setOtpError] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);
    const [openResetPassword, setOpenResetPassword] = useState(false);
    const [token, setToken] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);

    const otpBoxReference = useRef<HTMLInputElement[]>([]);

    function handleChange(value: string, index: number) {
        const newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);

        if (value && index < numberOfDigits - 1) {
            otpBoxReference.current[index + 1]?.focus();
        }
    }

    function handleBackspaceAndEnter(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                otpBoxReference.current[index - 1]?.focus();
            } else {
                const newArr = [...otp];
                newArr[index] = "";
                setOtp(newArr);
            }
        }
        if (e.key === "Enter" && e.currentTarget.value && index < numberOfDigits - 1) {
            otpBoxReference.current[index + 1]?.focus();
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = otp.join("");
        setToken(token);
        setIsSending(true);
        try {
            const response = await fetch(`${fetchUrl}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, email }),
                credentials: 'include'
            });

            if (response.ok) {
                setOpenResetPassword(true);
            } else {
                const errorData = await response.json();
                setOtpError(errorData.message);
            }
        } catch (error) {
            console.error("Erro ao verificar o token:", error);
        }
        finally{
            setIsSending(false);
        }
    }

    async function handleResendCode() {
        setIsResending(true);
        try {
            const response = await fetch(`${fetchUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Código de verificação reenviado:", data);
                setOtpError(null);
            } else {
                const errorData = await response.json();
                setOtpError(errorData.message);
                console.log("Erro ao reenviar o código:", errorData);
            }
        } catch (error) {
            console.error("Erro ao reenviar o código:", error);
            setOtpError("Erro ao reenviar o código.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <>
            {!openResetPassword ? (
                <>
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-center">
                            <img className="mx-auto w-40" src="./bau.webp" alt="logo" />
                            <h3 className="mb-8 mt-1 pb-1 text-lg font-semibold">
                                Código enviado!
                            </h3>
                        </div>
                        
                        <p className="mb-4 text-m text-center">
                            Insira no campo abaixo o código enviado para seu e-mail.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className='flex items-center gap-4'>
                                {otp.map((digit, index) => (
                                    <input key={index} value={digit} maxLength={1}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleBackspaceAndEnter(e, index)}
                                        ref={(reference) => { otpBoxReference.current[index] = reference as HTMLInputElement }}
                                        className={`border w-20 h-auto text-black p-3 rounded-md block bg-white focus:border-2 focus:outline-none appearance-none`}
                                    />
                                ))}
                            </div>
                            {otpError && <p className="text-red-500 text-center mt-2">{otpError}</p>}
                            <div className="flex flex-col space-y-5 mt-8">
                                <button type="submit" className={`flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 border-none text-white text-sm shadow-sm ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSending} style={{ background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)' }}>
                                    {isSending ? (
                                        <>
                                            <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                            Enviando...
                                        </>
                                        ) : (
                                        <>
                                            Enviar
                                        </>
                                    )}
                                </button>
                                <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                    <p>Não recebeu o código?</p> 
                                    <button 
                                        className="flex flex-row items-center text-green-900" 
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                    >
                                        {isResending ? "Reenviando..." : "Reenviar"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <ResetPassword email={email} token={token} />
            )}
        </>
    );
}