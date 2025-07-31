import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Settings } from "lucide-react";
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
                <Home className="mr-2 h-4 w-4" />
                Dashboard
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