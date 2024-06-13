'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import { MyExams } from './MyExams';
import { Graphs } from './Graphs';
import { CSS } from '../utils';
import Profile from '../profile/page';
import Image from 'next/image';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

interface NavbarProps {
  onData: (data: JSX.Element) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onData }) => {
  const [profileImg, setProfileImg] = useState();

  const [navigation, setNavigation] = useState([
    { name: 'Meus exames', current: true, component: <MyExams/>, type: 'menu' },
    { name: 'Gráficos', current: false, component: <Graphs/>, type: 'menu' },
    { name: 'Meu perfil', current: false, component: <Profile/>, type: 'profile' },
  ]);

  const handleNavigationClick = (name: any) => {
    const updatedNavigation = navigation.map(item =>
      item.name === name ? { ...item, current: true } : { ...item, current: false }
    );
    setNavigation(updatedNavigation);

    const currentItem = updatedNavigation.find(item => item.current);

    if (currentItem) {
        onData(currentItem.component);
    } else {
      onData(<></>)
    }
  };
  
    //"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

  return (
    <Disclosure as="nav" className={`${CSS.navBgColor}`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mb-6">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className={`relative inline-flex items-center justify-center rounded-md p-2 text-white ${CSS.bgColorHover} hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}>
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir menu principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image src='/bau.jpg' alt='Logo' className='h-10 w-auto' width={256} height={256}/>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-2">
                    {navigation.filter((item) => item.type === 'menu').map((item) => (
                      <button
                        key={item.name}
                        className={classNames(
                        item.current ? `${CSS.bgColorCurrent}` : `${CSS.bgColorHover}`,
                          `${CSS.textColor} rounded-md px-5 py-2 text-sm font-medium transition ease-out`
                        )}
                        aria-current={item.current ? 'page' : undefined}
                        onClick={() => handleNavigationClick(item.name)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Ver notificações</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className={`relative flex rounded-full bg-white ${!profileImg ? 'p-2' : ''} text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800`}>
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Abrir menu do usuário</span>
                      {profileImg ? 
                      <img
                        className="h-10 w-10 rounded-full"
                        src={profileImg}
                        alt="Foto de perfil"
                      /> 
                      :
                      <UserIcon className="h-6 w-6" aria-hidden="true" />
                      }
                      
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ focus }) => (
                          <DisclosureButton
                            onClick={() => handleNavigationClick('Meu perfil')}
                            className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left')}
                          >
                            Meu perfil
                          </DisclosureButton>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <a
                            href="#"
                            className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Desconectar
                          </a>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.filter(item => item.type === 'menu').map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="button"
                  className={classNames(
                    item.current ? `${CSS.bgColorCurrent}` : `${CSS.bgColorHover}`,
                    `${CSS.textColor} block rounded-md px-3 py-2 text-base font-medium`
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => handleNavigationClick(item.name)}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
