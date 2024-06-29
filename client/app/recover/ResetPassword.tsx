import { useState } from "react";
import { useRouter } from "next/router";
import { fetchUrl } from "../utils";

interface ResetPasswordProps {
    email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch(`${fetchUrl}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                router.push('/login'); // Redireciona para a página de login após a redefinição de senha
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Ocorreu um erro ao redefinir a senha.");
            }
        } catch (error) {
            console.error("Erro ao redefinir a senha:", error);
            setError("Ocorreu um erro ao redefinir a senha.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
                <h3 className="mb-8 mt-1 pb-1 text-lg font-semibold">
                    Redefinição de Senha
                </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Nova Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar Nova Senha
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Redefinir Senha
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;