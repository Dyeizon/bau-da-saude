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
        setToken(otp.join(""));

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
                            <img className="mx-auto w-40" src="./bau.jpg" alt="logo" />
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
                                <button type="submit" className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 border-none text-white text-sm shadow-sm" style={{ background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)' }}>
                                    Enviar
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