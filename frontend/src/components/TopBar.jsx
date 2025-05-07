import React from "react";
import { LogOut, Users, BookOpen, UserCog, ClipboardList } from "lucide-react";
import LogoAcademia from "./LogoAcademia";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../utils/utils";

function TopBar({ userId, selectedDashboard, setSelectedDashboard, showText = true }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const dashboards = [
    {
      title: "Aulas",
      icon: ClipboardList,
      href: "/main/aulas",
    },
    {
      title: "Alunos",
      icon: Users,
      href: "/main/alunos",
    },
    {
      title: "Turmas",
      icon: BookOpen,
      href: "/main/turmas",
    },
    {
      title: "Instrutores",
      icon: UserCog,
      href: "/main/instrutores",
    },

    // {
    //   title: "Relatórios",
    //   icon: BookOpenIcon,
    //   href: "/main/relatorios",
    // },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleNavClick = (path) => {
    const dashboard = path.split('/').pop();
    setSelectedDashboard(dashboard);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16  items-center justify-between border-b px-4 shadow-sm bg-indigo-700 text-white">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <LogoAcademia className="hidden md:flex" />
        <LogoAcademia className="flex md:hidden" showText={false} />
      </div>

      {/* Navbar Section */}
      <nav className="flex items-center gap-6">
        {dashboards.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            onClick={() => handleNavClick(item.href)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 text-base font-normal rounded-md",
                (isActive || selectedDashboard === item.href.split('/').pop())
                  ? "bg-background text-indigo-700 dark:bg-blue-500 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )
            }
          >
            <item.icon className="h-5 w-5" />
              <span className="hidden lg:inline-block">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Dropdown Section */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-accent/50"
            onClick={toggleDropdown}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {userId && userId.substring(0, 2).toUpperCase()}
            </div>
              <span className="hidden text-sm font-medium lg:inline-block">{userId}</span>

          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover text-popover-foreground shadow-md">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;