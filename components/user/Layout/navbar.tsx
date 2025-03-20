import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Kbd } from "@heroui/kbd";
import NextLink from "next/link";
import clsx from "clsx";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { GiHamburgerMenu } from "react-icons/gi"; 
import FloatingSocMed from "./floatingsocmed";
export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // const searchInput = (
  //   <Input
  //     aria-label="Search"
  //     classNames={{
  //       inputWrapper: "bg-default-100",
  //       input: "text-sm",
  //     }}
  //     endContent={
  //       <Kbd className="hidden lg:inline-block" keys={["command"]}>
  //         K
  //       </Kbd>
  //     }
  //     labelPlacement="outside"
  //     placeholder="Search..."
  //     startContent={
  //       <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
  //     }
  //     type="search"
  //   />
  // );

  return (
<>
  {/* Sidebar (Off-Canvas) */}
  <div
    className={`fixed top-0 left-0 z-50 h-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
      isSidebarOpen ? "transform translate-x-0" : "transform -translate-x-full"
    }`}
  >
    <div className="p-4">
      <button onClick={toggleSidebar} className="absolute top-4 right-4">
        <span className="text-2xl">X</span>
      </button>
      <div className="flex items-center justify-center mt-5 w-full">
        <Logo />
      </div>

      <ul className="flex flex-col space-y-4 mt-6">
        {siteConfig.navItems.map((item) => (
          <li key={item.href}>
            <NextLink
              className={clsx("text-lg font-medium hover:text-primary", "text-black")}
              href={item.href}
            >
              {item.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Navbar */}
  <HeroUINavbar maxWidth="xl" position="sticky">
    {/* Left Side - Logo & Nav Links */}
    <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
      <NavbarBrand as="li" className="gap-3 max-w-fit">
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <Logo />
        </NextLink>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex gap-4 justify-start ml-2">
        {siteConfig.navItems.map((item) => (
          <NavbarItem key={item.href}>
            <NextLink
              className={clsx("text-lg font-medium hover:text-primary", "text-black dark:text-white")}
              href={item.href}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        ))}
      </ul>
    </NavbarContent>

    {/* Right Side - Theme Switch & Social Media */}
    <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
      <NavbarItem className="hidden sm:flex gap-2">
        <ThemeSwitch />
      </NavbarItem>

      {/* Floating Social Media - Positioned in the Navbar */}
  
    </NavbarContent>

    {/* Mobile Menu Toggle */}
    <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
      <button onClick={toggleSidebar} className="sm:hidden p-3">
        <GiHamburgerMenu className="text-3xl cursor-pointer text-black dark:text-white" />
      </button>
      <FloatingSocMed/>
    </NavbarContent>
  </HeroUINavbar>
</>

  );
};
