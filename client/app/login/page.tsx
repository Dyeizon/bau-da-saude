'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    return (
        <section className="gradient-form h-full bg-neutral-200 dark:bg-neutral-700">
            <div className="h-full">
                <div
                className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
                <div className="w-full">
                    <div
                    className="block bg-white dark:bg-neutral-800">
                    <div className="h-screen g-0 lg:flex lg:flex-wrap">
                        <div className="m-auto px-4 md:px-0 lg:w-6/12">
                        <div className="md:mx-6 md:p-12">
                            <div className="text-center">
                            <img
                                className="mx-auto w-48"
                                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                alt="logo" />
                            <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                                Baú da Saúde
                            </h4>
                            </div>

                            <form>
                            <p className="mb-4">Faça login na sua conta</p>
                            <div className="relative mb-4" data-twe-input-wrapper-init>
                                <input
                                type="email"
                                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}/>
                                
                                <label
                                htmlFor="email"
                                className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out ${email ? '-translate-y-[0.9rem] scale-[0.8] text-primary' : 'peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'}peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                                >Email</label>
                            </div>

                            <div className="relative mb-4" data-twe-input-wrapper-init>
                                <input
                                type="password"
                                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                id="password"
                                placeholder="Senha" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}/>
                                <label
                                htmlFor="password"
                                className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out ${password ? '-translate-y-[0.9rem] scale-[0.8] text-primary' : 'peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary'}peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
                                >Senha
                                </label>
                            </div>
                            <div className="mb-12 pb-1 pt-1 text-center">
                                <button
                                className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                type="button"
                                data-twe-ripple-init
                                data-twe-ripple-color="light"
                                style={{background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'}}>
                                Entrar
                                </button>
                                <a href="#!">Esqueceu a senha?</a>
                            </div>

                            <div className="flex items-center pb-6">
                                <p className="mb-0 me-2">Não tem uma conta?</p>
                                <button
                                type="button"
                                style={{background: 'lightblue'}}
                                className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-danger-50/50 hover:text-danger-600 focus:border-danger-600 focus:bg-danger-50/50 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-rose-950 dark:focus:bg-rose-950"
                                data-twe-ripple-init
                                data-twe-ripple-color="light"
                                onClick={e => router.push('/register')}>
                                Cadastre-se
                                </button>
                            </div>
                            </form>
                        </div>
                        </div>

                        <div
                        className="flex items-center lg:w-6/12"
                        style={{background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'}}>
                        <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                            <h4 className="mb-6 text-xl font-semibold">
                            We are more than just a company
                            </h4>
                            <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip ex
                            ea commodo consequat.
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
    );
}