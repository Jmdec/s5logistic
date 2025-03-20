
import { Bars4Icon } from "@heroicons/react/20/solid";
import React from "react";
import { ThemeSwitch } from "../theme-switch";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  return (
    <div className="bg-white border-b-1 border-gray-200 p-3 dark:bg-gray-800">
      <div className="flex justify-between items-center">
       <div>
       <button
          className="lg:hidden p-2 text-gray-700"
          onClick={onToggleSidebar}
        >
          <Bars4Icon className="w-6 h-6 text-black dark:text-white" />
        </button>
       </div>
        <div className="mr-2">
        {/* <ThemeSwitch /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
