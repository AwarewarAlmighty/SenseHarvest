import React from "react";
import { NavLink } from "react-router-dom";
import { Monitor, Home, User, Settings} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-40 bg-background border-r">
      <div className="flex items-center justify-center h-16 px-6 border-b">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80"
          alt="SenseHarvest Logo"
          className="h-8 w-8 rounded-md"
        />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start"
            )
          }
        >
          <Monitor className="mr-2 h-4 w-4" />
          Dashboard
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start"
            )
          }
        >
          <Home className="mr-2 h-4 w-4" />
          Inventory
        </NavLink>
        <NavLink
          to="/EmployeesLogs"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start"
            )
          }
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-id-card-lanyard-icon lucide-id-card-lanyard mr-2 h-4 w-4"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/>
        </svg>
          Logs
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start"
            )
          }
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start"
            )
          }
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
