'use client';

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  return (
    <section className="h-screen w-screen" style={{backgroundImage: 'url("/bau_background.png")', backgroundSize: 'cover'}}>
      <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
        <div className="block bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
          <div className="lg:flex lg:flex-wrap">
            <div className="m-auto md:px-0">
              <div className="md:mx-6 md:p-6">
                <div className="text-center">
                  <img className="mx-auto w-40" src="./bau.jpg" alt="logo" />
                  <h2 className="mt-1 pb-1 text-xl font-semibold">
                    Baú da Saúde
                  </h2>
                  <h3 className="mb-8 mt-1 pb-1 text-xl font-semibold">
                    Esqueceu sua senha? Iremos lhe ajudar!
                  </h3>
                </div>
                
                <form>
                  <p className="mb-4 text-m text-center">
                    Por gentileza insira no campo abaixo o e-mail corresponde à conta cadastrada.<br />Lhe enviaremos um código para recuperar sua senha.
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
                      className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                      type="button"
                      data-twe-ripple-init
                      data-twe-ripple-color="light"
                      style={{ background: 'linear-gradient(to right, #a6f696, #40962f, #40962f, #a6f696)' }}
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
