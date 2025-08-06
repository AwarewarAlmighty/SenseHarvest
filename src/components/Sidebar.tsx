import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Monitor, Home, User, Settings, Users, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="hidden md:flex md:flex-col h-screen bg-background border-r transition-all duration-500 ease-in-out relative"
      style={{ width: isOpen ? '200px' : '60px' }}
    >
      <div className="flex items-center justify-center h-16 px-2 border-b">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80"
          alt="SenseHarvest Logo"
          className="h-8 w-8 rounded-md"
        />
        {isOpen && <span className="ml-2 text-lg font-semibold whitespace-nowrap">SenseHarvest</span>}
      </div>
      <nav className="flex-1 px-2 py-6 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <Monitor className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <Home className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Inventory</span>}
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                "w-full justify-start",
                isOpen ? "px-4" : "px-2"
              )
            }
          >
            <Users className={cn("h-4 w-4", isOpen && "mr-2")} />
            {isOpen && <span className="whitespace-nowrap">Employees</span>}
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink
            to="/admin-approval"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                "w-full justify-start",
                isOpen ? "px-4" : "px-2"
              )
            }
          >
            <UserCheck className={cn("h-4 w-4", isOpen && "mr-2")} />
            {isOpen && <span className="whitespace-nowrap">Approval</span>}
          </NavLink>
        )}
        <NavLink
          to="/EmployeesLogs"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={cn("h-4 w-4", isOpen && "mr-2")}><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/>
        </svg>
          {isOpen && <span className="whitespace-nowrap">Logs</span>}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <User className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Profile</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <Settings className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Settings</span>}
        </NavLink>
      </nav>
      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
