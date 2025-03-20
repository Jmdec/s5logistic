
import { Bars4Icon } from "@heroicons/react/20/solid";
import React from "react";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  return (
    <div className="bg-white border-b-1 border-gray-200 p-3">
      <div className="flex justify-between items-center">
        <button
          className="lg:hidden p-2 text-gray-700"
          onClick={onToggleSidebar}
        >
          <Bars4Icon className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
