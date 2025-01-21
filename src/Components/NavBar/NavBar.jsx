import Hamburger from "hamburger-react";
import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { BellIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useSearch } from "../../Context/SearchProvider";

const NavBar = () => {
  const { auth, user, setAuth, setUser } = useAuth();
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();

  const { resetJobs } = useSearch();

  const logout = () => {
    setAuth(null);
    setUser(null);
    navigate(`/login/${user.role}`);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <header className="header">
        <div className="header__container flex justify-between items-center p-[1rem]">
          <div className="header__logo-container hidden md:block">
            <h1 className="header__logo text-[25px]">
              <NavLink to="/" onClick={() => resetJobs()}>
                <strong>Elite</strong>Jobs
              </NavLink>
            </h1>
          </div>

          <div className="header__logo-container-mobile md:hidden">
            <h1 className="header__logo text-[25px]">
              <NavLink to="/">
                <strong>E</strong>J
              </NavLink>
            </h1>
          </div>

          {auth == null ? (
            <div className="header__menu md:flex gap-3 hidden md:items-center">
              <li className="header__menu-list ">
                <button className="flex items-center pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px]">
                  <span className="text-[24px]">
                    <PlusIcon className="h-5 w-5 mr-1" />
                  </span>
                  <NavLink to="/login/provider">Post a Job</NavLink>
                </button>
              </li>
              <li className="header__menu-list ">
                <button className="bg-[#F7671E] text-white pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px] ">
                  <NavLink to="/login/consumer">consumer sign in</NavLink>
                </button>
              </li>
              <li className="header__menu-list ">
                <button className="bg-indigo-600  text-white pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px]">
                  <NavLink to="/login/provider">provider sign in</NavLink>
                </button>
              </li>
            </div>
          ) : (
            <div className="md:flex gap-4 hidden  md:items-center">
              {user.role === "provider" && (
                <li>
                  <button className=" pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px]">
                    <NavLink className="flex items-center" to="/jobs/manage">
                      <span className="text-[24px]">
                        <PlusIcon className="h-5 w-5 mr-1" />
                      </span>
                      Post a Job
                    </NavLink>
                  </button>
                </li>
              )}
              <li>
                <NavLink
                  to={
                    user.role === "provider"
                      ? "/provider/calendar"
                      : "/consumer/calendar"
                  }
                >
                  Calendar
                </NavLink>
              </li>
              <li>
                <BellIcon className="w-5 h-5" />
              </li>
              <li>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button>
                      {user.photo && (
                        <img
                          className="inline-block h-9 w-9 object-cover rounded-full ring-2 ring-white"
                          // src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                          src={user.role === "provider" && user.photo}
                          alt="Avatar of Jonathan Reinink"
                        />
                      )}

                      {!user.photo && (
                        <div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {user.role === "provider" && (
                          <Menu.Item>
                            {({ active }) => (
                              <NavLink
                                to="/jobs/manage"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                My Jobs
                              </NavLink>
                            )}
                          </Menu.Item>
                        )}

                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to={`/${user.role}/requests`}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Job Requests
                            </NavLink>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="submit"
                              onClick={logout}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block w-full px-4 py-2 text-left text-sm"
                              )}
                            >
                              Log out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            </div>
          )}

          <div className="md:hidden">
            <Hamburger
              hideOutline={false}
              rounded
              size={24}
              label="show menu"
              toggled={isOpened}
              toggle={setIsOpened}
            />
          </div>
        </div>

        {/* Mobile hamburger */}
        {isOpened && auth == null && (
          <div className="header__menu flex flex-col md:hidden  gap-3  items-center mb-10">
            <li className="header__menu-list ">
              <button className="flex items-center pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px]">
                <span className="text-[24px]">
                  <PlusIcon className="h-5 w-5 mr-1" />
                </span>
                Post a Job
              </button>
            </li>
            <li className="header__menu-list ">
              <button className="bg-[#F7671E] text-white pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px]">
                <NavLink to="/login/consumer">consumer sign in</NavLink>
              </button>
            </li>
            <li className="header__menu-list ">
              <button className="bg-[#2D68C2] text-white pr-[15px] pl-[15px] pt-[4px] pb-[4px] rounded-[4px]">
                <NavLink to="/login/provider">provider sign in</NavLink>
              </button>
            </li>
          </div>
        )}

        {isOpened && auth != null && (
          <div>
            <Transition.Root show={isOpened}>
              <Dialog
                as="div"
                className="relative z-40 md:hidden"
                onClose={setIsOpened}
              >
                <div className="fixed inset-0 z-40 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                      <div className="flex items-center justify-between px-4">
                        <NavLink className="flex items-center gap-4">
                          {user.photo && (
                            <img
                              className="inline-block h-9 w-9 object-cover rounded-full ring-2 ring-white"
                              // src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                              src={user.role === "provider" && user.photo}
                              alt="Avatar of Jonathan Reinink"
                            />
                          )}

                          {!user.photo && (
                            <div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-300">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <h2 className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h2>
                        </NavLink>
                      </div>
                      <div className="mt-4 border-t border-gray-200">
                        <ul className="px-2 py-3 font-medium text-gray-900">
                          <li>
                            <NavLink to="/" className="block px-2 py-3">
                              Home
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={
                                user.role === "provider"
                                  ? "/provider/calendar"
                                  : "/consumer/calendar"
                              }
                              className="block px-2 py-3"
                            >
                              Calendar
                            </NavLink>
                          </li>
                          {user.role === "provider" && (
                            <li>
                              <NavLink
                                to="/jobs/manage"
                                className="block px-2 py-3"
                              >
                                My Jobs
                              </NavLink>
                            </li>
                          )}

                          <li>
                            <NavLink
                              to={
                                user.role === "provider"
                                  ? "/provider/requests"
                                  : "/consumer/requests"
                              }
                              className="block px-2 py-3"
                            >
                              Job Requests
                            </NavLink>
                          </li>
                          <li>
                            <button
                              onClick={logout}
                              className="block px-2 py-3"
                            >
                              Log out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
