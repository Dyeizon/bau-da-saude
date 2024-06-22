'use client';

import {
  Disclosure
} from '@headlessui/react'
import { CSS } from '../utils';
import Image from 'next/image';

import { useRouter } from "next/navigation";

export const NavbarGuest: React.FC = () => {
  const router = useRouter();

  return (
    <Disclosure as="nav" className={`${CSS.navBgColor}`}>
      {() => (
        <>
          <div className="mx-auto w-full mb-6 relative">
            <div className="flex h-16 w-full items-center justify-center">
                <a href='/'><Image src='/bau.jpg' alt='Logo' className='h-10 w-auto' width={256} height={256}/></a>
                <button className='float-left absolute left-0' onClick={() => router.back()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="white" className="float-left size-10 ml-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                    </svg>
                </button>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
