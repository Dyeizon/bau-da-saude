import { useState } from "react";
import { fetchUrl } from "../utils";

interface ResetPasswordProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const [password, setPassword] = useState("");
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
          return false;
        }
      
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      
        return (
          uppercaseRegex.test(password) &&
          lowercaseRegex.test(password) &&
          specialCharRegex.test(password)
        );
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("");
            setConfirmPasswordError("As senhas não coincidem.");
            return;
        }
        else if (!validatePassword(password)) {
            setConfirmPasswordError("");
            setPasswordError(
                "A senha deve conter 8 caracteres ou mais, tendo ao menos uma letra maiúscula, uma letra minúscula e um caractere especial."
            );
            return;
        } else {
            setPasswordError("");
            setConfirmPasswordError("");
            setIsResetting(true);
        }
        
        try {
            const response = await fetch(`${fetchUrl}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, email, password }),
                credentials: 'include'
            });
            
            if (response.ok) {
                console.log("Senha redefinida com sucesso!");
                window.location.href = "/login";
            } else {
                const errorData = await response.json();
                setPasswordError(errorData.message || "Erro ao redefinir a senha.");
            }
        } catch (error) {
            console.error("Erro ao redefinir a senha:", error);
            setPasswordError("Erro ao redefinir a senha. Por favor, tente novamente mais tarde.");
        } finally {
            setIsResetting(false);
        }
            
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
                <img className="mx-auto w-40" src="./bau.jpg" alt="logo" />
                <h3 className="mb-8 mt-1 pb-1 text-lg font-semibold">
                    Redefinir Senha
                </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                    </label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                    />
                    {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha
                    </label>
                    <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                    />
                    {confirmPasswordError && <p className="text-red-500 text-xs">{confirmPasswordError}</p>}
                </div>
                

                <div className="flex flex-col space-y-4">
                    <button type="submit" className={`flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 border-none text-white text-sm shadow-sm ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isResetting} style={{ background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)' }}>
                        {isResetting ? (
                            <>
                                <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                Redefinindo senha...
                            </>
                            ) : (
                            <>
                                Redefinir senha
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}