import { useState } from "react";
import { fetchUrl } from "../utils";

interface ResetPasswordProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isResetting, setIsResetting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            setPasswordError("As senhas não coincidem.");
            return;
        }

        try {
            setIsResetting(true);

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
                <div className="mb-4 w-full">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        required
                    />
                </div>

                <div className="mb-4 w-full">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        required
                    />
                </div>

                {passwordError && <p className="text-red-500 text-center mt-2">{passwordError}</p>}

                <div className="flex flex-col space-y-5 mt-8">
                    <button type="submit" className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" style={{ background: 'color #40962f' }}>
                        {isResetting ? "Redefinindo..." : "Redefinir Senha"}
                    </button>
                </div>
            </form>
        </div>
    );
}