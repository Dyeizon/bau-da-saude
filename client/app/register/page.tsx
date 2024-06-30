'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthBarrier from "../login/AuthBarrier";

import { fetchUrl } from "../utils";

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [dataNasc, setDataNasc] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showDateInput, setShowDateInput] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [dataNascError, setDataNascError] = useState<string>("");

  const dateInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const stringToDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");

    return new Date(parseInt(year), parseInt(month)-1, parseInt(day));
  }

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
  

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let formValid = true;

    if (!name.trim()) {
      setNameError("Campo nome é obrigatório.");
      formValid = false;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError("Campo email é obrigatório.");
      formValid = false;
    } else {
      setEmailError("");
    }

    if (!dataNasc.trim()) {
      setDataNascError("Campo data de nascimento é obrigatório.");
      formValid = false;
    } else {
      setDataNascError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "A senha deve conter 8 caracteres ou mais, tendo ao menos uma letra maiúscula, uma letra minúscula e um caractere especial."
      );
      formValid = false;
    } else {
      setPasswordError("");
    }

    if (formValid) {
      (async function async() {
        try {
          const response = await fetch(`${fetchUrl}/users/${email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
    
          if (response.ok) {
            const data = await response.json();
    
            if (data.exists) {
              setEmailError("Este email já está cadastrado.");
              return;
            }
          } else {
            throw new Error("Erro ao verificar o email.");
          }

          setIsLoading(true);

          const birthDate = stringToDate(dataNasc);
          const requestBody = JSON.stringify({
            name,
            email,
            password,
            birthDate,
          });
    
          const registerResponse = await fetch(`${fetchUrl}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBody,
            credentials: "include",
          });
    
          if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            localStorage.setItem("token", registerData.token);
            router.push("/");
          } else {
            throw new Error("Erro no cadastro.");
          }
        } catch (error) {
          console.log("Erro no cadastro:", error);
          alert("Erro no cadastro");
        }
      })();
    }
    setIsLoading(false);
  };


  const handleDateSelect = () => {
    setShowDateInput(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dateInputRef.current && !dateInputRef.current.contains(event.target as Node) && dataNasc === "") {
      setShowDateInput(false);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (showDateInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateInput]);

  return (
    <AuthBarrier reverse>
      <section className="gradient-form h-full bg-neutral-200 dark:bg-neutral-700">
        <div className="h-full">
          <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full">
              <div className="block bg-white dark:bg-neutral-800">
                <div className="h-screen g-0 lg:flex lg:flex-wrap">
                  <div className="flex items-center lg:w-6/12" style={{backgroundImage: 'url("/bau_register.jpg")', backgroundSize: 'cover'}}></div>
                  <div className="m-auto px-4 md:px-0 lg:w-6/12">
                    <div className="md:mx-6 md:p-6">
                      <div className="text-center">
                        <img className="mx-auto w-36" src="./bau.jpg" alt="logo" />
                        <h4 className="mb-6 mt-1 pb-1 text-xl font-semibold">
                          Baú da Saúde
                        </h4>
                      </div>

                      <form onSubmit={handleFormSubmit}>
                        <p className="mb-4">Registre-se já em nosso sistema!</p>
                        <div className="relative mb-4" data-twe-input-wrapper-init>
                          <input
                            type="text"
                            className={`peer block min-h-[auto] w-full rounded ${nameError ? 'border-red-500' : 'border-0'} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-linear ${name ? 'focus:placeholder:opacity-100 peer-focus:text-primary' : ''} dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary`}
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                          />
                          <label
                            htmlFor="name"
                            className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out ${nameError ? 'text-red-500' : 'text-neutral-400'} ${name ? '-translate-y-[1rem] scale-[0.8] text-primary  bg-white rounded px-0.5' : 'peer-focus:-translate-y-[1rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-focus:bg-white px-0.5 peer-focus:rounded'} peer-data-[twe-input-state-active]:-translate-y-[1rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                          >
                            Nome
                          </label>
                          {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
                        </div>

                        <div className="relative mb-4" data-twe-input-wrapper-init>
                          {!showDateInput && (
                            <input
                              type="text"
                              className={`peer block min-h-[auto] w-full rounded ${dataNascError ? 'border-red-500' : 'border-0'} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-linear ${dataNasc ? 'focus:placeholder:opacity-100 peer-focus:text-primary' : ''} dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary`}
                              id="dataNasc"
                              placeholder=""
                              value={dataNasc ? formatDate(dataNasc) : ""}
                              onFocus={handleDateSelect}
                              onChange={e => setDataNasc(e.target.value)}
                            />
                          )}
                          {showDateInput && (
                            <input
                              type="date"
                              ref={dateInputRef}
                              className={`peer block min-h-[auto] w-full rounded ${dataNascError ? 'border-red-500' : 'border-0'} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-linear ${dataNasc ? 'focus:placeholder:opacity-100 peer-focus:text-primary' : ''} dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary`}
                              id="dataNascInput"
                              value={dataNasc}
                              onChange={e => setDataNasc(e.target.value)}
                            />
                          )}
                          <label
                            htmlFor="dataNasc"
                            className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out ${dataNascError ? 'text-red-500' : 'text-neutral-400'} ${dataNasc || showDateInput ? '-translate-y-[1rem] scale-[0.8] text-primary  bg-white rounded px-0.5' : 'peer-focus:-translate-y-[1rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-focus:bg-white px-0.5 peer-focus:rounded'} peer-data-[twe-input-state-active]:-translate-y-[1rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                          >
                            Data de Nascimento
                          </label>
                          {dataNascError && <p className="text-red-500 text-xs">{dataNascError}</p>}
                        </div>

                        <div className="relative mb-4" data-twe-input-wrapper-init>
                          <input
                            type="email"
                            className={`peer block min-h-[auto] w-full rounded ${emailError ? 'border-red-500' : 'border-0'} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-linear ${email ? 'focus:placeholder:opacity-100 peer-focus:text-primary' : ''} dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary`}
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                          />
                          <label
                            htmlFor="email"
                            className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out ${emailError ? 'text-red-500' : 'text-neutral-400'} ${email ? '-translate-y-[1rem] scale-[0.8] text-primary  bg-white rounded px-0.5' : 'peer-focus:-translate-y-[1rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-focus:bg-white px-0.5 peer-focus:rounded'} peer-data-[twe-input-state-active]:-translate-y-[1rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                          >
                            Email
                          </label>
                          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                        </div>

                        <div className="relative mb-4" data-twe-input-wrapper-init>
                          <input
                            type="password"
                            className={`peer block min-h-[auto] w-full rounded ${passwordError ? 'border-red-500' : 'border-0'} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-linear ${password ? 'focus:placeholder:opacity-100 peer-focus:text-primary' : ''} dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary`}
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <label
                            htmlFor="password"
                            className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] transition-all duration-200 ease-out ${passwordError ? 'text-red-500' : 'text-neutral-400'} ${password ? '-translate-y-[1rem] scale-[0.8] text-primary  bg-white rounded px-0.5' : 'peer-focus:-translate-y-[1rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-focus:bg-white px-0.5 peer-focus:rounded'} peer-data-[twe-input-state-active]:-translate-y-[1rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                          >
                            Senha
                          </label>
                          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                        </div>

                        <div className="mb-6 pb-1 pt-1 text-center">
                          <button
                            className={`mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                            type="submit"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                            style={{background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)'}}
                          >
                            {isLoading ? (
                              <>
                                <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                Cadastrando...
                              </>
                            ) : (
                              <>
                                Cadastrar
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center pb-6">
                          <p className="mb-0 me-2">Já tem uma conta?</p>
                          <button
                            type="button"
                            style={{background: 'darkgreen', color: 'white'}}
                            className="inline-block rounded border-0 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-danger-50/50 hover:text-danger-600 focus:border-danger-600 focus:bg-danger-50/50 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-rose-950 dark:focus:bg-rose-950"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                            onClick={e => router.push('/login')}
                          >
                            Faça o login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthBarrier>
  );
}