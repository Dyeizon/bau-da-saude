'use client';

import { fetchUrl } from "../utils";
import { useState } from "react";
import VerifyScreen from "./VerifyScreen";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [openVerifyCode, setOpenVerifyCode] = useState(false);

  const handleRecover = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Iniciando recuperação de senha');
    setIsSending(true);
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
            console.log('Resposta recebida:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email);
            setOpenVerifyCode(true);
        } else {
            const errorData = await response.json();
            console.log('Erro na resposta:', errorData);
        }
    } catch (error) {
        console.error('Erro ao enviar o email de recuperação:', error);
    }
    finally{
      setIsSending(false);
    }
  };

  return (
    <section className="h-screen w-screen" style={{backgroundImage: 'url("/bau_background.webp")', backgroundSize: 'cover'}}>
      <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-11/12 h-3/4 flex justify-center sm:w-3/4 lg:w-6/12 md:w-3/4 xl:w-5/12">
          <div className="flex">
            <div className="m-auto px-0">
              <div className="mx-6 p-6">
                {!openVerifyCode ? 
                  <>
                    <div className="text-center">
                      <img className="mx-auto w-40" src="./bau.webp" alt="logo" />
                      <h3 className="mb-8 mt-1 pb-1 text-lg font-semibold">
                        Esqueceu sua senha?
                      </h3>
                    </div>
                    
                    <form onSubmit={handleRecover}>
                      <p className="mb-4 text-m text-center">
                        Insira no campo abaixo o e-mail correspondente.<br />Lhe enviaremos um código para recuperar sua senha.
                      </p>
                      <div className="relative mb-4" data-twe-input-wrapper-init>
                        <input
                          type="email"
                          className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none focus:outline-none focus:border-none focus:ring-0 transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                          id="email"
                          placeholder="Email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                        <label
                          htmlFor="email"
                          className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out ${email ? '-translate-y-[0.9rem] scale-[0.8] text-primary' : 'peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'} peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                        >
                          Email
                        </label>
                      </div>

                      <div className="pb-1 pt-1 text-center">
                        <button
                          className={`mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isSending}
                          type="submit"
                          data-twe-ripple-init
                          data-twe-ripple-color="light"
                          style={{ background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)' }}
                        >
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
                      </div>
                    </form>
                  </>
                  : 
                  <VerifyScreen email={email} />
                }
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}