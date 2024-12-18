import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import Image from "next/image";
import { useFetchUser } from "@/hooks/useFetchUser";
import LoginButton from "./LoginButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useFetchUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" min-w-full flex items-center justify-between font-semibold p-4 bg-[#0a0a0a] backdrop-blur-md text-gray-50">
      <div className="flex flex-row space-x-2">
        <h1 className="text-2xl font-bold">BANKLY</h1>
      </div>

      {/* Hamburger Icon for Mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none z-20"
      >
        {isOpen ? (
          <X className="h-6 w-6  transition-transform transform duration-300" />
        ) : (
          <Menu className="h-6 w-6 transition-transform transform duration-300" />
        )}
      </button>

      {/* Menu Links with Smooth Animations */}
      <div
        className={`${
          isOpen
            ? "max-h-screen opacity-100 flex flex-col items-center"
            : "max-h-0 opacity-0 flex flex-col items-center"
        } md:max-h-full md:opacity-100 transition-all duration-500 ease-in-out transform overflow-hidden md:flex md:flex-row md:items-center md:space-x-6 absolute md:relative top-14 left-0 right-0 md:top-0 bg-[#0c0c0c] md:bg-transparent z-10 md:z-auto`}
      >
        <a href="/" className="block px-4 py-2  hover:text-gray-400">
          Home
        </a>
        <a href="/about" className="block px-4 py-2  hover:text-gray-400">
          About
        </a>
        <a href="/contact" className="block px-4 py-2  hover:text-gray-400">
          Contact
        </a>
        {isAuthenticated && (
          <a href="/dashboard" className="block px-4 py-2  hover:text-gray-400">
            Dashboard
          </a>
        )}

        {/* User Menu and Auth Buttons */}
        <div className="flex flex-col items-center sm:flex-row sm:space-x-4">
          <UserMenu />
          {!isAuthenticated && <LoginButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
